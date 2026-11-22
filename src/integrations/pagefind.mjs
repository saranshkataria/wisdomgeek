// @ts-check

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pagefind from "pagefind";

/**
 * Builds the search index once Astro has written the site: Pagefind reads the
 * built HTML and writes the index, with its search UI, to dist/pagefind/.
 * Only posts are indexed, as BlogPost.astro marks their content with
 * data-pagefind-body. `astro dev` doesn't run this hook, so search only works
 * in builds.
 * @returns {import("astro").AstroIntegration}
 */
export default function pagefindIndex() {
  return {
    name: "pagefind",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        try {
          const { index, errors } = await pagefind.createIndex();
          if (!index) throw new Error(errors.join("\n"));

          const added = await index.addDirectory({ path: outDir });
          if (added.errors.length > 0) throw new Error(added.errors.join("\n"));

          const written = await index.writeFiles({ outputPath: path.join(outDir, "pagefind") });
          if (written.errors.length > 0) throw new Error(written.errors.join("\n"));

          // addDirectory counts every HTML file; Pagefind's entry file has the pages it indexed
          const entry = JSON.parse(await readFile(path.join(written.outputPath, "pagefind-entry.json"), "utf8"));
          const indexed = Object.values(entry.languages).reduce((sum, language) => sum + language.page_count, 0);
          logger.info(`Indexed ${indexed} of ${added.page_count} pages into ${path.relative(process.cwd(), written.outputPath)}`);
        } finally {
          await pagefind.close();
        }
      },
    },
  };
}
