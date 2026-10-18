// Script to fetch WordPress posts and save them as markdown files
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";
import { gfm } from "@joplin/turndown-plugin-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://www.wisdomgeek.com";
const PER_PAGE = 100;
const CONTENT_DIR = path.join(__dirname, "../src/content");
const DATA_DIR = path.join(__dirname, "../src/config");

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

const EXTENSIONS_BY_CONTENT_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "image/bmp": ".bmp",
  "image/x-ms-bmp": ".bmp",
};
const IMAGE_EXTENSIONS = new Set([
  ".jpeg",
  ...Object.values(EXTENSIONS_BY_CONTENT_TYPE),
]);
// Keeps src/content/.../<image> paths short enough for Windows tooling
const MAX_IMAGE_PATH_LENGTH = 150;
// Markdown [text] allowing two levels of nested brackets, e.g. [![alt [1]](src)](href)
const MD_TEXT = String.raw`\[(?:\\.|[^\\\[\]]|\[(?:\\.|[^\\\[\]]|\[(?:\\.|[^\\\[\]])*\])*\])*\]`;
// Markdown (destination "optional title")
const MD_TARGET = String.raw`\(\s*((?:\\.|[^\s()\\])+)((?:\s+(?:"[^"]*"|'[^']*'))?\s*)\)`;
const LINKED_IMAGE_PATTERN = new RegExp(
  String.raw`\[\s*!(${MD_TEXT})${MD_TARGET}\s*\]${MD_TARGET}`,
  "g"
);
const IMAGE_PATTERN = new RegExp(`!(${MD_TEXT})${MD_TARGET}`, "g");
const LINK_PATTERN = new RegExp(`(?<!!)(${MD_TEXT})${MD_TARGET}`, "g");

const shortHash = (value) =>
  createHash("sha1").update(value).digest("hex").slice(0, 8);

async function replaceAsync(text, pattern, replacer) {
  const replacements = [];
  for (const match of text.matchAll(pattern)) {
    replacements.push(await replacer(...match));
  }
  return text.replace(pattern, () => replacements.shift());
}

// Absolute, protocol-relative or root-relative URLs; local paths return null
function resolveRemoteUrl(value) {
  if (!/^(https?:)?\//i.test(value)) return null;
  try {
    const url = new URL(
      value.replace(/\\([()])/g, "$1").replace(/&amp;/g, "&"),
      SITE_URL
    );
    // http://wisdomgeek.com/x and https://www.wisdomgeek.com/x are the same file
    return isSiteUrl(url) ? new URL(url.pathname + url.search, SITE_URL) : url;
  } catch {
    return null;
  }
}

function isSiteUrl(url) {
  return (
    url.hostname.replace(/^www\./, "") ===
    new URL(SITE_URL).hostname.replace(/^www\./, "")
  );
}

function isUploadUrl(url) {
  return isSiteUrl(url) && url.pathname.startsWith("/wp-content/uploads/");
}

// WordPress size variants look like name-300x200.png; the original upload is name.png
function originalUploadPath(url) {
  return url.pathname.replace(/-\d+x\d+(\.\w+)$/, "$1");
}

// For size variants try the original upload first
function downloadCandidates(url) {
  const original = originalUploadPath(url);
  return isUploadUrl(url) && original !== url.pathname
    ? [new URL(original, url).href, url.href]
    : [url.href];
}

function isSameUpload(link, image) {
  return (
    Boolean(link) &&
    isUploadUrl(link) &&
    isUploadUrl(image) &&
    originalUploadPath(link) === originalUploadPath(image)
  );
}

// Gallery thumbnails link to attachment pages such as /20160615100612_1/ or /?attachment_id=123
function isAttachmentPage(link, image) {
  if (!link || !isSiteUrl(link) || link.pathname.startsWith("/wp-content/")) {
    return false;
  }
  if (link.searchParams.has("attachment_id")) return true;
  const slug = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const page = slug(link.pathname.split("/").filter(Boolean).pop() || "");
  const file = slug(
    image.pathname
      .split("/")
      .pop()
      .replace(/(-\d+x\d+)?\.\w+$/, "")
  );
  return page !== "" && page === file;
}

async function fetchFile(url, image) {
  const response = await fetch(url);
  const type = (response.headers.get("content-type") || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (
    !response.ok ||
    type === "text/html" ||
    (image && !type.startsWith("image/"))
  ) {
    await response.body?.cancel();
    return null;
  }
  return { buffer: Buffer.from(await response.arrayBuffer()), type };
}

// Some uploads are no longer served by WordPress; the Internet Archive often still has them
async function fetchArchivedFile(url, image) {
  const response = await fetch(
    `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`
  );
  const snapshot = response.ok
    ? (await response.json()).archived_snapshots?.closest
    : null;
  return snapshot?.available
    ? fetchFile(
        `https://web.archive.org/web/${snapshot.timestamp}id_/${url}`,
        image
      )
    : null;
}

// sharp can't read BMP, so decode uncompressed 24/32-bit bitmaps by hand and save them as PNG
async function convertBmpToPng(buffer) {
  const offset = buffer.readUInt32LE(10);
  const width = buffer.readInt32LE(18);
  const height = buffer.readInt32LE(22);
  const bitsPerPixel = buffer.readUInt16LE(28);
  if (
    buffer.toString("latin1", 0, 2) !== "BM" ||
    ![24, 32].includes(bitsPerPixel) ||
    buffer.readUInt32LE(30) !== 0
  ) {
    throw new Error(`Unsupported BMP (${bitsPerPixel}-bit)`);
  }
  const rows = Math.abs(height);
  const stride = Math.ceil((width * bitsPerPixel) / 32) * 4;
  const pixels = Buffer.alloc(width * rows * 3);
  for (let y = 0; y < rows; y++) {
    const row = offset + (height > 0 ? rows - 1 - y : y) * stride; // rows are bottom-up unless height < 0
    for (let x = 0; x < width; x++) {
      const source = row + (x * bitsPerPixel) / 8;
      const target = (y * width + x) * 3;
      pixels[target] = buffer[source + 2];
      pixels[target + 1] = buffer[source + 1];
      pixels[target + 2] = buffer[source];
    }
  }
  const { default: sharp } = await import("sharp");
  return sharp(pixels, { raw: { width, height: rows, channels: 3 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

// Downloads every image a post references (and links to /wp-content/uploads/ files),
// saves them next to index.md and rewrites the references to relative paths.
async function localizeImages(markdown, postDir, heroImage) {
  const label = path.relative(CONTENT_DIR, postDir).split(path.sep).join("/");
  const pathLength =
    path.relative(path.join(__dirname, ".."), postDir).length + 1;
  const maxNameLength = Math.max(20, MAX_IMAGE_PATH_LENGTH - pathLength);
  const usedNames = new Set(["index.md", heroImage.replace(/^\.\//, "")]);
  const savedFiles = new Map(); // remote URL -> local file name (null if it couldn't be downloaded)
  const unavailable = new Set(); // "<source> <URL>" pairs that returned no usable file

  function saveFile(fileUrl, buffer, extension, stem) {
    stem = stem.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
    let name = stem + extension;
    if (name.length > maxNameLength || usedNames.has(name)) {
      const prefix = stem
        .slice(0, Math.max(1, maxNameLength - extension.length - 9))
        .replace(/[-.]+$/, "");
      name = `${prefix}-${shortHash(fileUrl)}${extension}`;
    }
    usedNames.add(name);
    fs.writeFileSync(path.join(postDir, name), buffer);
    return name;
  }

  async function download(candidates, image) {
    const sources = { site: fetchFile, archive: fetchArchivedFile };
    for (const [source, fetchCandidate] of Object.entries(sources)) {
      for (const candidate of candidates) {
        if (savedFiles.get(candidate)) return savedFiles.get(candidate);
        if (unavailable.has(`${source} ${candidate}`)) continue;
        const file = await fetchCandidate(candidate, image).catch(() => null);
        if (!file) {
          unavailable.add(`${source} ${candidate}`);
          continue;
        }
        if (source === "archive") {
          console.log(
            `Using the Internet Archive copy of ${candidate} for ${label}`
          );
        }
        const { pathname } = new URL(candidate);
        let extension = path.extname(pathname).toLowerCase();
        let stem = path.basename(pathname, path.extname(pathname));
        let { buffer } = file;
        // URLs without a usable file name (e.g. Google-hosted images) get a short hash instead
        if (!extension || (image && !IMAGE_EXTENSIONS.has(extension))) {
          extension = EXTENSIONS_BY_CONTENT_TYPE[file.type];
          stem = `image-${shortHash(candidate)}`;
          if (!extension) {
            throw new Error(`Unsupported content type ${file.type}`);
          }
        }
        if (extension === ".bmp") {
          buffer = await convertBmpToPng(buffer);
          extension = ".png";
        }
        const name = saveFile(candidate, buffer, extension, stem);
        savedFiles.set(candidate, name);
        return name;
      }
    }
    throw new Error("not found on the site or in the Internet Archive");
  }

  // Images are always downloaded; links only when they point at an uploaded file
  async function localize(value, image) {
    const url = resolveRemoteUrl(value);
    if (!url || (!image && !isUploadUrl(url))) return null;
    if (!savedFiles.has(url.href)) {
      try {
        savedFiles.set(
          url.href,
          await download(downloadCandidates(url), image)
        );
      } catch (error) {
        console.warn(
          `Failed to download ${url.href} for ${label}: ${error.message}`
        );
        savedFiles.set(url.href, null);
      }
    }
    return savedFiles.get(url.href);
  }

  let content = await replaceAsync(
    markdown,
    LINKED_IMAGE_PATTERN,
    async (match, alt, src, srcTitle, href, hrefTitle) => {
      const image = await localize(src, true);
      let link = await localize(href, false);
      const imageUrl = resolveRemoteUrl(src);
      const linkUrl = resolveRemoteUrl(href);
      // Attachment pages and unavailable originals of the same image link to the local copy instead
      if (
        !link &&
        image &&
        (isAttachmentPage(linkUrl, imageUrl) || isSameUpload(linkUrl, imageUrl))
      ) {
        link = image;
      }
      const imageMarkdown = `!${alt}(${image ? `./${image}` : src}${srcTitle})`;
      // Uploads that exist neither on the site nor in the archive lose their (dead) link
      if (!link && linkUrl && isUploadUrl(linkUrl)) return imageMarkdown;
      if (!image && !link) return match;
      return `[${imageMarkdown}](${link ? `./${link}` : href}${hrefTitle})`;
    }
  );
  content = await replaceAsync(
    content,
    IMAGE_PATTERN,
    async (match, alt, src, title) => {
      const image = await localize(src, true);
      return image ? `!${alt}(./${image}${title})` : match;
    }
  );
  content = await replaceAsync(
    content,
    LINK_PATTERN,
    async (match, text, href, title) => {
      const file = await localize(href, false);
      if (file) return `${text}(./${file}${title})`;
      const url = resolveRemoteUrl(href);
      return url && isUploadUrl(url) ? text.slice(1, -1) : match;
    }
  );
  // Raw HTML left in the Markdown: <img src/srcset> and <a href>
  return replaceAsync(content, /<(img|a)\b[^>]*>/gi, (tag, tagName) =>
    replaceAsync(
      tag,
      /(\s(src|srcset|href)\s*=\s*["'])([^"']*)/gi,
      async (match, prefix, attribute, value) => {
        const image = tagName.toLowerCase() === "img";
        const name = attribute.toLowerCase();
        if (image ? name === "href" : name !== "href") return match;
        let changed = false;
        const rewritten = [];
        for (const source of name === "srcset" ? value.split(",") : [value]) {
          const [url, ...descriptor] = source.trim().split(/\s+/);
          const file = await localize(url, image);
          changed ||= Boolean(file);
          rewritten.push([file ? `./${file}` : url, ...descriptor].join(" "));
        }
        return changed ? prefix + rewritten.join(", ") : match;
      }
    )
  );
}

function convertHtmlToMarkdown(html) {
  return turndownService.turndown(removeShortcodes(html));
}

const hasClass = (node, name) =>
  (node.getAttribute("class") || "").split(/\s+/).includes(name);

// Code Block Pro shows the language's display name (code-block-pro's
// defaultLanguages.json); lowercased, it is the Shiki language id except for these
const CODE_BLOCK_PRO_LANGUAGES = {
  "BAT (Batchfile)": "bat",
  "C#": "csharp",
  "C++": "cpp",
  "F#": "fsharp",
  "Objective-C++": "objective-cpp",
  Plaintext: "text",
  "Plain Text": "text",
  "Protocol Buffers": "proto",
};

function codeBlockProLanguage(label) {
  const language =
    CODE_BLOCK_PRO_LANGUAGES[label] ?? label.toLowerCase().replace(/\s+/g, "-");
  return /^[a-z][\w#+.-]*$/.test(language) ? language : "";
}

// Text of a <pre>, keeping <br> line breaks
function preformattedText(node) {
  return Array.from(node.childNodes, (child) => {
    if (child.nodeType === 3) return child.nodeValue;
    if (child.nodeName === "BR") return "\n";
    return child.nodeType === 1 ? preformattedText(child) : "";
  }).join("");
}

function fencedCodeBlock(code, language) {
  // The fence must be longer than any backtick fence inside the code
  const fenceLength = Math.max(
    3,
    ...Array.from(code.matchAll(/^[ \t]*(`{3,})/gm), (m) => m[1].length + 1)
  );
  const fence = "`".repeat(fenceLength);
  return `\n\n${fence}${language}\n${code}\n${fence}\n\n`;
}

function embedFromUrl(url) {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const src = youtube
    ? `https://www.youtube.com/embed/${youtube[1]}`
    : vimeo && `https://player.vimeo.com/video/${vimeo[1]}`;
  if (!src) {
    return `[${turndownService.escape(url)}](${url.replace(/[()]/g, "\\$&")})`;
  }
  return `<iframe src="${src}" width="740" height="416" frameborder="0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
}

// Caption of a <figure>, a classic [caption] box or a [gallery] item
function captionOf(node) {
  if (
    node.nodeName !== "FIGURE" &&
    !hasClass(node, "wp-caption") &&
    !hasClass(node, "gallery-item")
  ) {
    return null;
  }
  const caption = Array.from(node.children).find(
    (child) =>
      child.nodeName === "FIGCAPTION" || hasClass(child, "wp-caption-text")
  );
  return caption?.textContent.trim() ? caption : null;
}

function isBoldRow(row) {
  return Array.from(row.children).every((cell) => {
    const text = cell.textContent.replace(/\s+/g, "");
    const bold = Array.from(
      cell.querySelectorAll("strong, b"),
      (element) => element.textContent
    ).join("");
    return text !== "" && text === bold.replace(/\s+/g, "");
  });
}

// "*" and "**" next to punctuation only work if the other side is a space or
// punctuation too (not in "<strong>Note:</strong>Text"); use HTML there
function emphasis(delimiter, tag) {
  return (content, node) => {
    // Code spans can't contain emphasis
    if (node.isCode) return content;
    // Line breaks (<br>) at either end go outside the delimiters
    const [, leading, inner, trailing] = content.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!inner) return content;
    const text = node.textContent;
    const before =
      leading || /^\s/.test(text) ? " " : node.previousSibling?.textContent.slice(-1);
    const after =
      trailing || /\s$/.test(text) ? " " : node.nextSibling?.textContent[0];
    const isWord = (char) => /[\p{L}\p{N}]/u.test(char ?? "");
    const isPunctuation = (char) => /[\p{P}\p{S}]/u.test(char ?? "");
    const delimitable =
      !(isPunctuation(inner[0]) && isWord(before)) &&
      !(isPunctuation(inner.at(-1)) && isWord(after));
    const emphasized = delimitable
      ? `${delimiter}${inner}${delimiter}`
      : `<${tag}>${inner}</${tag}>`;
    return leading + emphasized + trailing;
  };
}

const turndownService = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});
// The GFM plugin keeps tables with code blocks as HTML, but only finds them
// through this @joplin/turndown method, which plain turndown doesn't have
turndownService.isCodeBlock = (node) => node.nodeName === "PRE";
turndownService.use(gfm);
turndownService.remove(["script", "style", "meta"]);
turndownService.keep(["sub", "sup"]);

// Turndown leaves "<" and "&" alone, but in Markdown they start inline HTML and
// character references (text such as "code <path>" would disappear). A "!"
// before a link would turn the link into an image, and GFM would take a closing
// quote right after a plain URL into the URL's autolink.
const escapeMarkdown = turndownService.escape.bind(turndownService);
turndownService.escape = (text) =>
  escapeMarkdown(text)
    .replace(/</g, "\\<")
    .replace(/&(?=#?\w+;)/g, "\\&")
    .replace(/!$/, "\\!")
    .replace(
      /\bhttps?:\/\/[^\s<>”’]+(?=[”’])/g,
      (url) => `<${url.replace(/\\(.)/g, "$1")}>`
    );

// Same as Turndown's rule, with a single space after the list marker
turndownService.addRule("listItem", {
  filter: "li",
  replacement(content, node, options) {
    const list = node.parentNode;
    let prefix = `${options.bulletListMarker} `;
    if (list.nodeName === "OL") {
      const start = Number(list.getAttribute("start") || 1);
      prefix = `${start + Array.prototype.indexOf.call(list.children, node)}. `;
    }
    const isParagraph = /\n$/.test(content);
    const text = content.replace(/^\n+|\n+$/g, "") + (isParagraph ? "\n" : "");
    return (
      prefix +
      text.replace(/\n/g, `\n${" ".repeat(prefix.length)}`) +
      (node.nextSibling ? "\n" : "")
    );
  },
});

turndownService.addRule("emphasis", {
  filter: ["em", "i"],
  replacement: emphasis("*", "em"),
});

turndownService.addRule("strong", {
  filter: ["strong", "b"],
  replacement: emphasis("**", "strong"),
});

// Row breaks between [gallery] items
turndownService.addRule("galleryBreak", {
  filter: (node) => node.nodeName === "BR" && hasClass(node.parentNode, "gallery"),
  replacement: () => "",
});

turndownService.addRule("preformatted", {
  filter: "pre",
  replacement(content, node) {
    const [child, ...rest] = Array.from(node.children);
    const code = child?.nodeName === "CODE" && !rest.length ? child : node;
    const classes = [node, code].map((el) => el.getAttribute("class") ?? "");
    const language =
      classes.join(" ").match(/\blang(?:uage)?-([\w#+.-]+)/)?.[1] ?? "";
    return fencedCodeBlock(preformattedText(code), language);
  },
});

// Code Block Pro: a Shiki-highlighted <pre> plus spans for the window controls,
// the copy button and the language name
turndownService.addRule("codeBlockPro", {
  filter: (node) => hasClass(node, "wp-block-kevinbatdorf-code-block-pro"),
  replacement(content, node) {
    const pre = node.querySelector("pre");
    if (!pre) return content;
    const label = Array.from(node.children).find(
      (child) =>
        child.nodeName === "SPAN" &&
        !hasClass(child, "code-block-pro-copy-button") &&
        child.textContent.trim()
    );
    const language = label ? codeBlockProLanguage(label.textContent.trim()) : "";
    return fencedCodeBlock(preformattedText(pre), language);
  },
});

// Players are kept as HTML, which Astro renders as is
turndownService.addRule("embed", {
  filter: ["iframe", "video", "audio"],
  replacement: (content, node) => `\n\n${node.outerHTML}\n\n`,
});

// Keep wrappers whose inline style sizes the player (e.g. a 16:9 padding box)
turndownService.addRule("embedWrapper", {
  filter: (node) =>
    node.nodeName === "DIV" &&
    node.hasAttribute("style") &&
    node.children.length === 1 &&
    node.firstElementChild.nodeName === "IFRAME" &&
    !node.textContent.trim(),
  replacement: (content, node) => `\n\n${node.outerHTML}\n\n`,
});

// oEmbed blocks that WordPress could not render contain only the URL
turndownService.addRule("embedUrl", {
  filter: (node) =>
    hasClass(node, "wp-block-embed__wrapper") &&
    !node.children.length &&
    /^https?:\/\/\S+$/.test(node.textContent.trim()),
  replacement: (content, node) =>
    `\n\n${embedFromUrl(node.textContent.trim())}\n\n`,
});

// Captions are written by the figure rule
turndownService.addRule("caption", {
  filter: (node) => captionOf(node.parentNode) === node,
  replacement: () => "",
});

// <figure> and <figcaption> are HTML, but the content between the blank lines
// stays Markdown, so images are still downloaded and processed by Astro
turndownService.addRule("figure", {
  filter: (node) => Boolean(captionOf(node)),
  replacement(content, node) {
    const caption = captionOf(node).innerHTML.replace(/\s+/g, " ").trim();
    return `\n\n<figure>\n\n${content.trim()}\n\n<figcaption>${caption}</figcaption>\n</figure>\n\n`;
  },
});

// Tables often have a bold first row instead of a header row; Markdown tables need one
turndownService.addRule("boldHeaderRow", {
  filter: (node) =>
    node.nodeName === "TABLE" &&
    !node.querySelector("thead, th") &&
    node.rows.length > 1 &&
    isBoldRow(node.rows[0]) &&
    !Array.from(node.rows).every(isBoldRow),
  replacement(content, node) {
    const document = node.ownerDocument;
    const wrapper = document.createElement("div");
    const table = wrapper.appendChild(node.cloneNode(true));
    const row = table.rows[0];
    const head = document.createElement("thead");
    head.appendChild(row);
    table.insertBefore(head, table.firstChild);
    for (const cell of Array.from(row.children)) {
      const th = document.createElement("th");
      while (cell.firstChild) th.appendChild(cell.firstChild);
      row.replaceChild(th, cell);
    }
    return `\n\n${turndownService.turndown(wrapper)}\n\n`;
  },
});

const SHORTCODE = new RegExp(
  String.raw`\[(\/?)([a-z][\w-]*)((?:\s+[\w-]+=(?:"[^"]*"|'[^']*'|&#82(?:20|21|43);[^\]]*?&#82(?:21|43);|[^\s\]]+))*)\s*\/?\]`,
  "gi"
);

// Shortcodes of plugins that are no longer active stay in the HTML as text: drop
// their tags outside code and keep what they wrap. A bare "[word]" is only a
// shortcode if a matching "[/word]" exists, so bracketed prose is kept.
function removeShortcodes(html) {
  const kept = [];
  const text = html.replace(
    /<(pre|code|script|style)\b[\s\S]*?<\/\1>|<[^>]*>/gi,
    (match) => `\u0000${kept.push(match) - 1}\u0000`
  );
  const closed = new Set(
    Array.from(text.matchAll(SHORTCODE))
      .filter((match) => match[1])
      .map((match) => match[2].toLowerCase())
  );
  return text
    .replace(SHORTCODE, (match, slash, name, attributes) =>
      slash || attributes || closed.has(name.toLowerCase()) ? "" : match
    )
    .replace(/\u0000(\d+)\u0000/g, (match, index) => kept[index]);
}

// Folder for a post that mirrors its WordPress permalink, so the Astro entry id
// (and therefore the URL) stays the same as the live site, e.g.
// "https://www.wisdomgeek.com/featured/my-post/" -> "featured/my-post".
// Returns null if the link is missing, invalid or not on SITE_URL's host.
function getPermalinkPath(link) {
  try {
    const url = new URL(link);
    if (url.host !== new URL(SITE_URL).host) return null;
    const segments = url.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => decodeURIComponent(segment));
    // An encoded slash would change the nesting or escape the content folder
    if (segments.some((segment) => /[\\/]/.test(segment))) return null;
    return segments.join("/") || null;
  } catch {
    return null;
  }
}

async function fetchWordPressPosts() {
  console.log(`Fetching posts from ${SITE_URL}`);

  try {
    let page = 1;
    let allPosts = [];
    let hasMorePosts = true;

    // Fetch all pages of posts
    while (hasMorePosts) {
      console.log(`Fetching page ${page}...`);
      const response = await fetch(
        `${SITE_URL}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed`
      );

      if (!response.ok) {
        if (response.status === 400) {
          // No more posts available
          hasMorePosts = false;
          break;
        }
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const posts = await response.json();

      if (posts.length === 0) {
        hasMorePosts = false;
        break;
      }

      allPosts = allPosts.concat(posts);
      console.log(
        `Fetched ${posts.length} posts from page ${page} (total: ${allPosts.length})`
      );

      // Check if there are more pages
      const totalPages = response.headers.get("X-WP-TotalPages");
      if (totalPages && page >= parseInt(totalPages)) {
        hasMorePosts = false;
      } else {
        page++;
      }
    }

    console.log(`\nTotal posts fetched: ${allPosts.length}`);

    // Process each post
    for (const post of allPosts) {
      const cleanContent = convertHtmlToMarkdown(post.content.rendered);

      // Get categories with hierarchy - WordPress stores them with parent information
      const categories = post._embedded?.["wp:term"]?.[0] || [];

      // Find the category with the deepest hierarchy (for categoryHierarchy and
      // the fallback folder) and collect all category names
      let categoryPath = "general";
      let primaryCategoryPath = ["General"];
      const allCategoryNames = [];

      if (categories.length > 0) {
        // Find the category with the longest path (deepest hierarchy)
        let deepestCategory = categories[0];
        let maxDepth = 0;

        for (const cat of categories) {
          const link = cat.link || "";
          const linkMatch = link.match(/https?:\/\/[^\/]+\/(.+?)\/$/);
          if (linkMatch) {
            const depth = linkMatch[1].split("/").length;
            if (depth > maxDepth) {
              maxDepth = depth;
              deepestCategory = cat;
            }
          }
          // Collect all category names
          allCategoryNames.push(cat.name);
        }

        // Use the deepest category for the category hierarchy
        const categoryLink = deepestCategory.link || "";
        const linkMatch = categoryLink.match(/https?:\/\/[^\/]+\/(.+?)\/$/);
        if (linkMatch) {
          categoryPath = linkMatch[1].toLowerCase();
        } else {
          // Fallback: just use the slug
          categoryPath = (deepestCategory.slug || "general").toLowerCase();
        }

        // Convert the path to a hierarchy array
        // e.g., "development/web-development/javascript" -> ["Development", "Web Development", "JavaScript"]
        const pathParts = categoryPath.split("/");
        primaryCategoryPath = pathParts.map((part) => {
          // Convert slug to title case
          return part
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        });
      }

      const primaryCategory = categoryPath.split("/")[0] || "general";

      // Create post directory at the post's permalink path so it keeps its live
      // URL; fall back to the deepest category folder if the link is unusable
      const postSlug = post.slug.toLowerCase();
      let postPath = getPermalinkPath(post.link);
      if (!postPath) {
        postPath = `${categoryPath}/${postSlug}`;
        console.warn(
          `No usable permalink for post ${post.id} (${post.link}), using ${postPath}`
        );
      }
      const postDir = path.join(CONTENT_DIR, postPath);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Get featured image if available and download it
      const remoteImageUrl =
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
      let heroImage = "";

      if (remoteImageUrl) {
        try {
          const imageExtension =
            path.extname(new URL(remoteImageUrl).pathname) || ".jpg";
          const localImageFilename = `hero${imageExtension}`;
          const localImagePath = path.join(postDir, localImageFilename);

          // Download the image
          await downloadImage(remoteImageUrl, localImagePath);

          // Set the hero image path relative to the index.md file
          heroImage = `./${localImageFilename}`;
          console.log(`Downloaded image for ${postPath}`);
        } catch (error) {
          console.warn(
            `Failed to download image for ${postPath}: ${error}`
          );
          heroImage = ""; // Skip image if download fails
        }
      }

      // Download inline images and update content
      let processedContent = await localizeImages(
        cleanContent,
        postDir,
        heroImage
      );

      // Format date for frontmatter
      const pubDate = new Date(post.date);
      const formattedDate = pubDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });

      // Format modified date for frontmatter (used for sitemap lastmod)
      const modifiedDate = new Date(post.modified);
      const formattedModifiedDate = modifiedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });

      // Get author name from embedded data
      const authorName = post._embedded?.author?.[0]?.name || "";

      const title = htmlToText(post.title.rendered);
      const description = buildDescription(post.excerpt.rendered);

      // Get tags (name + slug, so tag pages can reproduce the live /tag/<slug>/ URLs).
      // _embed returns at most 10 terms per taxonomy, so fetch the full list when needed.
      let tagTerms = (post._embedded?.["wp:term"] || [])
        .flat()
        .filter((term) => term.taxonomy === "post_tag");
      if (post.tags?.length > tagTerms.length) {
        const response = await fetch(
          `${SITE_URL}/wp-json/wp/v2/tags?post=${post.id}&per_page=100`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch tags for ${post.slug}: ${response.statusText}`
          );
        }
        tagTerms = await response.json();
      }
      const tags = tagTerms.map((term) => ({
        name: htmlToText(term.name),
        slug: term.slug,
      }));

      // Create markdown content
      const markdown = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
pubDate: '${formattedDate}'
updatedDate: '${formattedModifiedDate}'
heroImage: '${heroImage}'
author: '${authorName.replace(/'/g, "''")}'
categories: ${JSON.stringify(allCategoryNames)}
categoryHierarchy: ${JSON.stringify(primaryCategoryPath)}
tags: [${tags.map((tag) => `{ name: ${JSON.stringify(tag.name)}, slug: ${JSON.stringify(tag.slug)} }`).join(", ")}]
---

${processedContent}
`;

      // Write markdown file as index.md in the post directory
      const filePath = path.join(postDir, "index.md");
      fs.writeFileSync(filePath, markdown, "utf-8");
      console.log(`Saved ${postPath}/index.md`);
    }

    console.log(`WordPress posts saved to ${CONTENT_DIR}`);
  } catch (error) {
    console.error(`Error loading WordPress posts: ${error}`);
    throw error;
  }
}

const DESCRIPTION_MAX_LENGTH = 160;
// End on a sentence only if that keeps at least this many characters
const DESCRIPTION_MIN_SENTENCE_LENGTH = 100;

// Named entities WordPress may emit; numeric references are decoded generically
const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  rarr: "→",
  larr: "←",
};

function decodeHtmlEntities(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z][a-z\d]*);/gi, (entity, ref) => {
    if (ref[0] !== "#") {
      return Object.hasOwn(NAMED_ENTITIES, ref) ? NAMED_ENTITIES[ref] : entity;
    }
    const codePoint =
      ref[1].toLowerCase() === "x"
        ? parseInt(ref.slice(2), 16)
        : parseInt(ref.slice(1), 10);
    return codePoint > 0 && codePoint <= 0x10ffff
      ? String.fromCodePoint(codePoint)
      : entity;
  });
}

// Converts an HTML fragment (title, excerpt, term name) to a single line of plain text
function htmlToText(html) {
  const text = html
    .replace(/<\/?(?:p|br|div|li|h[1-6]|blockquote|pre)\b[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "");
  return decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
}

// Builds a meta description from the excerpt: plain text of at most
// DESCRIPTION_MAX_LENGTH characters, ending on a sentence where possible
function buildDescription(excerptHtml) {
  const excerpt = htmlToText(excerptHtml);
  // WordPress appends "..." / "[…]" when it shortens the excerpt
  const text = excerpt.replace(/\s*(?:\[\s*(?:…|\.{3})\s*\]|…|\.{3})$/, "");
  if (text === excerpt && text.length <= DESCRIPTION_MAX_LENGTH) {
    return text;
  }

  let sentenceEnd = 0;
  for (const match of text.matchAll(/[.!?]["'”’)]*(?=\s|$)/g)) {
    const end = match.index + match[0].length;
    if (end > DESCRIPTION_MAX_LENGTH) break;
    sentenceEnd = end;
  }
  if (sentenceEnd >= DESCRIPTION_MIN_SENTENCE_LENGTH) {
    return text.slice(0, sentenceEnd);
  }

  // Cut at the last word boundary that leaves room for the ellipsis
  const limit = DESCRIPTION_MAX_LENGTH - 1;
  const cut = text.length <= limit ? text.length : text.lastIndexOf(" ", limit);
  return text.slice(0, cut > 0 ? cut : limit).replace(/[\s,;:–—-]+$/, "") + "…";
}

async function fetchAvatarAsBase64(url) {
  if (!url) return "";
  try {
    const response = await fetch(url);
    if (!response.ok) return "";
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return "";
  }
}

async function fetchWordPressAuthors() {
  try {
    const response = await fetch(
      `${SITE_URL}/wp-json/wp/v2/users?per_page=100`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }
    const users = await response.json();

    const authors = [];
    for (const user of users.filter((u) => u.description)) {
      const avatarUrl = user.avatar_urls?.["96"] || "";
      console.log(`Fetching avatar for ${user.name}...`);
      const avatarBase64 = await fetchAvatarAsBase64(avatarUrl);
      authors.push({
        name: user.name,
        slug: user.slug,
        description: user.description,
        url: user.url,
        avatar: avatarBase64,
      });
    }

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(
      path.join(DATA_DIR, "authors.json"),
      JSON.stringify(authors, null, 2),
      "utf-8"
    );
    console.log(`Saved ${authors.length} authors to src/config/authors.json`);
  } catch (error) {
    console.error(`Error fetching authors: ${error}`);
    throw error;
  }
}

await fetchWordPressPosts();
// await fetchWordPressAuthors();
