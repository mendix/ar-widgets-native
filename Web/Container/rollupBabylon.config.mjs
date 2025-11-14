import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import analyze from "rollup-plugin-analyzer";

export default [
  // ES module build for React mode
  {
    input: "../../node_modules/@babylonjs/core/index.js",
    output: {
      format: "es",
      file: "./src/bundle/babylonjscore.js",
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs({
        requireReturnsDefault: 'auto',
      }),
      analyze({ summaryOnly: true, limit: 20 }),
      terser({
        output: {
          comments: /@preserve|@?copyright|@lic|@cc_on|licen[cs]e|^\**!/i,
        },
      }),
    ],
  },
  // UMD build for both React and Dojo compatibility
  {
    input: "../../node_modules/@babylonjs/core/index.js",
    output: {
      format: "umd",
      file: "./src/bundle/babylonjscore.umd.js",
      name: "BABYLON",
      globals: {
        '@babylonjs/core': 'BABYLON'
      }
    },
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs({
        requireReturnsDefault: 'auto'
      }),
      analyze({ summaryOnly: true, limit: 5 })
    ],
  }
];
