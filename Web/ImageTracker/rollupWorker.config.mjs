import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import bundleSize from "rollup-plugin-bundle-size";

export default {
    input: "./src/Worker.tsx",
    output: {
        format: "umd",
        file: "./src/bundle/Worker.js"
    },

    plugins: [
        typescript(),
        resolve(),
        getBabelOutputPlugin({
            allowAllFormats: true,
            babelrc: false,
            compact: false,
            shouldPrintComment: () => true,
            presets: [["@babel/preset-env", { targets: { safari: "12" } }]]
        }),
        bundleSize()
    ]
};
