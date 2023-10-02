import babel from "@rollup/plugin-babel";
import shebang from "rollup-plugin-preserve-shebang";

export default [
  {
    input: "src/client/index.js",
    output: {
      format: "esm",
      file: "dist/client.js",
    },
    plugins: [babel({ babelHelpers: "bundled", exclude: "node_modules/**" })],
  },
  {
    input: "src/server/index.js",
    output: {
      format: "esm",
      file: "dist/server.js",
    },
    plugins: [babel({ babelHelpers: "bundled", exclude: "node_modules/**" })],
  },
  {
    input: "./eject.js",
    output: {
      format: "esm",
      file: "dist/eject.js",
    },
    plugins: [
      babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
      shebang(),
    ],
  },
];
