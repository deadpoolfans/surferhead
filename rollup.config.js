import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

const CHUNKS = [
  { input: "src/client/index.ts", output: "hammerhead.js" },
  { input: "src/client/index.ts", output: "hammerhead.min.js" },
  { input: "src/client/transport-worker/index.ts", output: "transport-worker.js" },
  { input: "src/client/transport-worker/index.ts", output: "transport-worker.min.js" },
  { input: "src/client/worker/index.ts", output: "worker-hammerhead.js" },
  { input: "src/client/worker/index.ts", output: "worker-hammerhead.min.js" }
];

const CONFIG = CHUNKS.map(chunk => ({
  input: chunk.input,
  output: {
    file: path.join("lib/client", chunk.output),
    format: "iife",
    // NOTE: 'use strict' in our scripts can break user code
    // https://github.com/DevExpress/testcafe/issues/258
    strict: false
  },

  plugins: [
    resolve(),
    esbuild({
      tsconfig: "src/client/tsconfig.json",
      minify: chunk.output.endsWith("min.js"),
      include: [
        "src/**/*.ts",
        // NOTE: transpile the acorn-hammerhead package because it has non-ES5 compatible code
        "node_modules/acorn-hammerhead/**/*.js"
      ]
    }),
    commonjs()
  ],

  onwarn (warning, rollupWarn) {
    if (warning.code === "CIRCULAR_DEPENDENCY")
      return;

    if (warning.code === "MISSING_NAME_OPTION_FOR_IIFE_EXPORT")
      return;

    rollupWarn(warning);
  }
}));

export default CONFIG;
