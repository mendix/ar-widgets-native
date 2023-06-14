import { getBabelOutputPlugin } from "@rollup/plugin-babel";
// require("@rollup/amd-loader");
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import analyze from "rollup-plugin-analyzer";
import bundleSize from "rollup-plugin-bundle-size";

export default {
    input: "./src/Worker.tsx",
    output: {
        format: "umd",
        file: "./src/bundle/Worker.js",
        // paths: {"@zxing/library/cjs": "../../../shared/zxinglibrary.js"}
    },

    plugins: [
        typescript(),
        resolve(),
        // analyze({ summaryOnly: true, limit: 20 }),
   
        getBabelOutputPlugin({
            allowAllFormats: true,
            babelrc: false,
            // Disable compact output to keep comments
            compact: false,
            // Keep all comments (terser will process them).
            shouldPrintComment: () => true,
            presets: [["@babel/preset-env", { targets: { safari: "12" } }]]
        }),
        
        // terser({
        //     output: {
        //         comments: /@preserve|@?copyright|@lic|@cc_on|licen[cs]e|^\**!/i
        //     }
        // }),
        bundleSize()
    ]
};
