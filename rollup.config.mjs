
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default {
  input: "src/index.ts",
  // https://nodejs.org/api/packages.html#dual-commonjses-module-packages
  output: [
    {
      file: packageJson.exports['.'].require,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.exports['.'].import,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    // https://rollupjs.org/tools/#peer-dependencies
    // https://www.npmjs.com/package/rollup-plugin-peer-deps-external
    peerDepsExternal()
  ]
};