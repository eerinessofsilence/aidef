import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { OutputAsset } from "rollup";

function inlineEntryCss(): Plugin {
  return {
    name: "inline-entry-css",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const indexHtml = Object.values(bundle).find(
        (chunk): chunk is OutputAsset =>
          chunk.type === "asset" && chunk.fileName === "index.html",
      );

      if (!indexHtml || typeof indexHtml.source !== "string") {
        return;
      }

      let html = indexHtml.source;
      const stylesheetLinks: RegExpMatchArray[] = [
        ...html.matchAll(/<link rel="stylesheet" crossorigin href="([^"]+)">/g),
      ];

      for (const match of stylesheetLinks) {
        const href = match[1];
        const assetPath = href.startsWith("/") ? href.slice(1) : href;
        const cssAsset = bundle[assetPath];

        if (!cssAsset || cssAsset.type !== "asset") {
          continue;
        }

        const cssSource =
          typeof cssAsset.source === "string"
            ? cssAsset.source
            : cssAsset.source.toString();

        html = html.replace(
          match[0],
          `<style>${cssSource.replace(/<\/style/gi, "<\\/style")}</style>`,
        );

        delete bundle[assetPath];
      }

      indexHtml.source = html;
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    inlineEntryCss(),
  ],
});
