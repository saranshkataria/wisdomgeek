// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";

// Build a map of URLs to lastmod dates from content frontmatter
function getLastModDates() {
  const contentDir = "./src/content";
  /** @type {Map<string, Date>} */
  const dateMap = new Map();

  /** @param {string} dir @param {string} urlPath */
  function processDirectory(dir, urlPath = "") {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath, `${urlPath}/${entry.name}`);
      } else if (entry.name === "index.md" || entry.name === "index.mdx") {
        const content = fs.readFileSync(fullPath, "utf-8");
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const updatedDateMatch = frontmatter.match(/updatedDate:\s*['"](.+?)['"]/);

          if (updatedDateMatch) {
            const date = new Date(updatedDateMatch[1]);
            if (!isNaN(date.getTime())) {
              // urlPath directly maps to URL pathname
              dateMap.set(urlPath + "/", date);
            }
          }
        }
      }
    }
  }

  processDirectory(contentDir);
  return dateMap;
}

const lastModDates = getLastModDates();

// https://astro.build/config
export default defineConfig({
  site: "https://www.wisdomgeek.com",
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // Extract path from full URL
        const url = new URL(item.url);
        const pathname = url.pathname;

        // Look up lastmod date
        const lastmod = lastModDates.get(pathname);
        if (lastmod) {
          item.lastmod = lastmod.toISOString();
        }

        return item;
      },
    }),
  ],
});
