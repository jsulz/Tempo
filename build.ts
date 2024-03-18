import { createBuilder } from "ultra/build.ts";

const builder = createBuilder({
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./.git/**",
  "./.vscode/**",
  "./.github/**",
  "./.gitignore",
]);

/**
 * Add our own browser entrypoint, since we
 * aren't using the default
 */
builder.entrypoint("browser", {
  path: "./src/app.tsx",
  target: "browser",
});

// deno-lint-ignore no-unused-vars
const result = await builder.build();
