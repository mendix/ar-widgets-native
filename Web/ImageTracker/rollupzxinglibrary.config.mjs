import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import analyze from "rollup-plugin-analyzer";

export default [
    // ES module build for React mode
    {
        input: "../../node_modules/@zxing/library/esm/index.js",
        output: {
            format: "es",
            file: "./src/bundle/zxinglibrary.js"
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
                    comments: /@preserve|@?copyright|@lic|@cc_on|licen[cs]e|^\**!/i
                }
            })
        ]
    },
    // AMD build for Dojo mode  
    {
        input: "../../node_modules/@zxing/library/esm/index.js",
        output: {
            format: "amd",
            file: "./src/bundle/zxinglibrary.amd.js"
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
                    comments: /@preserve|@?copyright|@lic|@cc_on|licen[cs]e|^\**!/i
                }
            })
        ]
    }
];
