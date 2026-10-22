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

// Code block language labels; other languages (and plaintext) get no label
const codeLanguageLabels = new Map([
  ["bash", "Bash"],
  ["cpp", "C++"],
  ["css", "CSS"],
  ["graphql", "GraphQL"],
  ["html", "HTML"],
  ["java", "Java"],
  ["javascript", "JavaScript"],
  ["json", "JSON"],
  ["proto", "Protobuf"],
  ["python", "Python"],
  ["xml", "XML"],
]);

// Window-style dots in the code block bar, [fill, stroke], as on the WordPress site
const codeBarDots = [
  ["#ff5f56", "#e0443e"],
  ["#ffbd2e", "#dea123"],
  ["#27c93f", "#1aab29"],
];

/**
 * Builds a hast element, for the markup the transformer below adds
 * @param {string} tagName
 * @param {import("hast").Properties} properties
 * @param {import("hast").ElementContent[]} [children]
 * @returns {import("hast").Element}
 */
const h = (tagName, properties, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});

/**
 * Wraps each highlighted code block in a `.code-block` div, with a bar of
 * decorative dots on top and the language label below. The bar also hosts the
 * copy button BlogPost.astro adds. Both sit outside the pre, so they stay in
 * place while the code scrolls horizontally.
 * Astro caches rendered Markdown and doesn't notice edits to this function;
 * run `yarn build --force` after changing it.
 * @type {NonNullable<import("astro").ShikiConfig["transformers"]>[number]}
 */
const codeBlockWrapper = {
  name: "code-block-wrapper",
  root(root) {
    const [pre] = root.children;
    if (pre?.type !== "element" || pre.tagName !== "pre") return;

    const dots = h(
      "svg",
      { class: "code-dots", width: 54, height: 14, viewBox: "0 0 54 14", ariaHidden: "true" },
      codeBarDots.map(([fill, stroke], i) =>
        h("circle", { cx: String(7 + 20 * i), cy: "7", r: "6", fill, stroke, strokeWidth: "0.5" }),
      ),
    );
    const label = codeLanguageLabels.get(String(pre.properties.dataLanguage));
    root.children[0] = h("div", { class: "code-block" }, [
      h("div", { class: "code-bar" }, [dots]),
      pre,
      ...(label ? [h("span", { class: "code-lang" }, [{ type: "text", value: label }])] : []),
    ]);
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://www.wisdomgeek.com",
  // Astro 7 defaults to "jsx", which drops whitespace between elements on
  // separate lines; keep the HTML-aware behavior the templates were written for
  compressHTML: true,
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
  markdown: {
    shikiConfig: {
      // VS Code's Dark+ colors, as on the WordPress site
      theme: "dark-plus",
      transformers: [codeBlockWrapper],
    },
  },
});
