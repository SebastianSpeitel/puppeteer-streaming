import ts from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import vue from "rollup-plugin-vue";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import css from "rollup-plugin-postcss";

const production = process.env.NODE_ENV === "production";

export default {
  input: "src/main.ts",
  output: {
    format: "esm",
    dir: "dist",
    sourcemap: !production
  },
  plugins: [
    copy({ targets: [{ src: "./src/index.html", dest: "./dist" }] }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      )
    }),
    resolve(),
    vue(),
    css({ extract: "bundle.css" }),
    ts()
  ]
};
