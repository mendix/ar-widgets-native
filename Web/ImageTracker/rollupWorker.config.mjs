import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "./src/Worker.js",
    output: {
        format: "umd",
        file: "./src/bundle/Worker.js"
    },
    plugins: [
        resolve({
            preferBuiltins: false,
            browser: true
        }),
        commonjs()
    ]
};
