import typescript from "@rollup/plugin-typescript";
const copy = require("rollup-plugin-copy");
import commonjs from "@rollup/plugin-commonjs";

export default args => {
    const result = args.configDefaultConfig;
    result.treeshake = false;
    result.forEach(config => {
        const external = [/^@babylonjs\/core($|\/)/, /^@babylonjs\/loaders($|\/)/];
        config.external = [...config.external, ...external];

        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            }),
            commonjs(),
            copy({
                verbose: true,
                copyOnce: true,
                targets: [
                    {
                        src: "./babylonjsloadersGLTF.js",
                        dest: "dist/tmp/widgets/com/mendix/shared"
                    }
                ]
            }),
            copy({
                verbose: true,
                copyOnce: true,
                targets: [
                    {
                        src: "./babylonjsloadersOBJ.js",
                        dest: "dist/tmp/widgets/com/mendix/shared"
                    }
                ]
            })
        );
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": "../../../shared/babylonjscore.js",
            "@babylonjs/loaders/glTF": "../../../shared/babylonjsloadersGLTF.js",
            "@babylonjs/loaders/OBJ": "../../../shared/babylonjsloadersOBJ.js"
            // "@babylonjs/loaders/STL": "../../../shared/babylonjsloaders.js"
        };
    });
    return result;
};
