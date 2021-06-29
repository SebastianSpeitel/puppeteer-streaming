import ts from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
const pkg = require("./package.json");

export default {
  input: "src/index.ts",
  output: {
    format: "cjs",
    dir: "dist",
    banner: "#!/usr/bin/env node"
  },
  plugins: [ts(), json()],
  external: [...Object.keys(pkg.dependencies)]
};
