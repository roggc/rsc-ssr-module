import babel from "@rollup/plugin-babel";

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
];
