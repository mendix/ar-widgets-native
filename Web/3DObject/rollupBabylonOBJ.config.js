import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import postcssImport from "postcss-import";
import analyze from "rollup-plugin-analyzer";
import bundleSize from "rollup-plugin-bundle-size";
import postcss from "rollup-plugin-postcss";

export default {
    input: "../../node_modules/@babylonjs/loaders/GLTF/index.js",
    output: {
        format: "amd",
        file: "./babylonjsloadersOBJ.js"
    },

    plugins: [
        resolve(),
        commonjs(),
        analyze({ summaryOnly: true, limit: 20 }),
        replace({
            preventAssignment: true,
            values: {
                "process.env.NODE_ENV": JSON.stringify("development")
            }
        }),
        typescript(),
        url({
            // Disable inline images
            limit: 0,
            // Prefix for url, relative to Mendix web server root
            publicPath: `widgets/com/mendix/shared/chart-widget/assets/`,
            destDir: "dist/assets"
        }),
        postcss({
            extensions: [".css", ".sass", ".scss"],
            extract: true,
            inject: false,
            minimize: false,
            plugins: [postcssImport()],
            sourceMap: false,
            use: ["sass"],
            to: "dist/chart-widget.css"
        }),
        getBabelOutputPlugin({
            allowAllFormats: true,
            babelrc: false,
            // Disable compact output to keep comments
            compact: false,
            // Keep all comments (terser will process them).
            shouldPrintComment: () => true,
            presets: [["@babel/preset-env", { targets: { safari: "12" } }]]
        }),
        false
            ? terser({
                  output: {
                      comments: /@preserve|@?copyright|@lic|@cc_on|licen[cs]e|^\**!/i
                  }
              })
            : null,
        bundleSize()
    ]
};
