// Script to fetch WordPress posts and save them as markdown files
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

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
  let content = html;

  // Remove WordPress code block plugin wrappers first (Code Block Pro, etc.)
  // This removes the entire wrapper div and extracts just the code content
  content = content.replace(
    /<div[^>]*class="[^"]*code-block-pro[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    (match, innerContent) => {
      // Extract the actual code from pre/code tags
      const codeMatch = innerContent.match(
        /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i
      );
      if (codeMatch) {
        return "<pre><code>" + codeMatch[1] + "</code></pre>";
      }
      return match;
    }
  );

  // Convert images to markdown - do this before removing other HTML tags
  content = content.replace(
    /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
    "![$2]($1)"
  );
  content = content.replace(
    /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi,
    "![$1]($2)"
  );
  // Handle images without alt text
  content = content.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, "![]($1)");

  // Convert code blocks (pre + code tags) to markdown code blocks
  content = content.replace(
    /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (match, code) => {
      // Decode HTML entities in code
      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
      return "\n```\n" + decodedCode.trim() + "\n```\n";
    }
  );

  // Convert inline code tags to markdown
  content = content.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Convert strong/b tags to bold
  content = content.replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, "**$2**");

  // Convert em/i tags to italic
  content = content.replace(/<(em|i)>(.*?)<\/(em|i)>/gi, "*$2*");

  // Convert links
  content = content.replace(
    /<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    "[$2]($1)"
  );

  // Convert headings
  content = content.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n");
  content = content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n");
  content = content.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n");
  content = content.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n");
  content = content.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n");
  content = content.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n");

  // Convert lists
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, items) => {
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  });
  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, items) => {
    let counter = 1;
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`);
  });

  // Convert paragraphs to double line breaks
  content = content.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

  // Convert line breaks
  content = content.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining HTML tags
  content = content.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  content = content
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");

  // Clean up excessive whitespace
  content = content.replace(/\n{3,}/g, "\n\n").trim();

  return content;
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
