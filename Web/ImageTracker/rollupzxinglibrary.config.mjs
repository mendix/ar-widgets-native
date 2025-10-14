import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import analyze from "rollup-plugin-analyzer";
import bundleSize from "rollup-plugin-bundle-size";

export default {
    input: "../../node_modules/@zxing/library/cjs/index.js",
    output: {
        format: "amd",
        file: "./src/bundle/zxinglibrary.js"
    },

    plugins: [
        resolve(),
        commonjs(),
        analyze({ summaryOnly: true, limit: 20 }),
        typescript(),
        getBabelOutputPlugin({
            allowAllFormats: true,
            babelrc: false,
            // Disable compact output to keep comments
            compact: false,
            // Keep all comments (terser will process them).
            shouldPrintComment: () => true,
            presets: [["@babel/preset-env", { targets: { safari: "12" } }]]
        }),
        terser({
            output: {
                comments: /@preserve|@?copyright|@lic|@cc_on|licen[cs]e|^\**!/i
            }
        }),
        bundleSize()
    ]
};
