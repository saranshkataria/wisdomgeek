// Script to fetch WordPress posts and save them as markdown files
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
      const cleanExcerpt = convertHtmlToMarkdown(post.excerpt.rendered);

      // Get categories with hierarchy - WordPress stores them with parent information
      const categories = post._embedded?.["wp:term"]?.[0] || [];

      // Find the category with the deepest hierarchy (for folder structure)
      // and collect all category names
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

        // Use the deepest category for the folder structure
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

      // Create post directory with nested category structure (lowercase slug)
      const postSlug = post.slug.toLowerCase();
      const postDir = path.join(CONTENT_DIR, categoryPath, postSlug);
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
          console.log(`Downloaded image for ${categoryPath}/${postSlug}`);
        } catch (error) {
          console.warn(
            `Failed to download image for ${categoryPath}/${postSlug}: ${error}`
          );
          heroImage = ""; // Skip image if download fails
        }
      }

      // Download inline images and update content
      let processedContent = cleanContent;
      const imageMatches = [
        ...processedContent.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g),
      ];
      const downloadedImages = new Map(); // Track downloaded images to avoid duplicates

      for (const match of imageMatches) {
        const [fullMatch, altText, imageUrl] = match;

        // Skip if already downloaded
        if (downloadedImages.has(imageUrl)) {
          processedContent = processedContent.replace(
            fullMatch,
            `![${altText}](./${downloadedImages.get(imageUrl)})`
          );
          continue;
        }

        try {
          // Extract original filename from URL
          const urlPath = new URL(imageUrl).pathname;
          const originalFilename = path.basename(urlPath);

          // Use original filename, sanitize it for filesystem
          const localImageFilename = originalFilename
            .replace(/[^a-z0-9.-]/gi, "-")
            .toLowerCase();

          const finalFilename = localImageFilename;
          const localImagePath = path.join(postDir, finalFilename);

          // Download the inline image
          await downloadImage(imageUrl, localImagePath);

          // Track downloaded image
          downloadedImages.set(imageUrl, finalFilename);

          // Replace the URL with local path
          processedContent = processedContent.replace(
            fullMatch,
            `![${altText}](./${finalFilename})`
          );
        } catch (error) {
          console.warn(
            `Failed to download inline image for ${categoryPath}/${postSlug}: ${error.message}`
          );
          // Keep the original URL if download fails
        }
      }

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

      // Create markdown content
      const markdown = `---
title: '${post.title.rendered.replace(/'/g, "''")}'
description: '${cleanExcerpt.replace(/'/g, "''")}'
pubDate: '${formattedDate}'
updatedDate: '${formattedModifiedDate}'
heroImage: '${heroImage}'
author: '${authorName.replace(/'/g, "''")}'
categories: ${JSON.stringify(allCategoryNames)}
categoryHierarchy: ${JSON.stringify(primaryCategoryPath)}
---

${processedContent}
`;

      // Write markdown file as index.md in the post directory
      const filePath = path.join(postDir, "index.md");
      fs.writeFileSync(filePath, markdown, "utf-8");
      console.log(`Saved ${categoryPath}/${postSlug}/index.md`);
    }

    console.log(`WordPress posts saved to ${CONTENT_DIR}`);
  } catch (error) {
    console.error(`Error loading WordPress posts: ${error}`);
    throw error;
  }
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
