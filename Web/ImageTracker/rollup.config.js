import typescript from "@rollup/plugin-typescript";
const copy = require("rollup-plugin-copy");
import commonjs from "@rollup/plugin-commonjs";
// import replace from '@rollup/plugin-replace';

export default args => {
    const result = args.configDefaultConfig;
    result.forEach(config => {
        const external = [/^@babylonjs\/core($|\/)/];
        config.external = [...config.external, ...external];
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            }),
            commonjs()
        );
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": "../../../shared/babylonjscore.js"
        };
    });

    result.forEach((config, index) => {
        const external = [/^@zxing\/library($|\/)/];
        config.external = [...config.external, ...external];

        // Only for first entry
        if (index === 0) {
            config.plugins = [
                ...config.plugins,
                copy({
                    verbose: true,
                    copyOnce: true,
                    targets: [
                        {
                            src: "./src/bundle/zxinglibrary.js",
                            dest: "dist/tmp/widgets/com/mendix/shared"
                        }
                    ]
                })
            ];
        }
        config.output.paths = {
            ...config.output.paths,
            "@zxing/library/cjs": "../../../shared/zxinglibrary.js"
        };
    });


    result.forEach((config, index) => {
        // Only for first entry
        if (index === 0) {
            config.plugins = [
                ...config.plugins,
                copy({
                    verbose: true,
                    copyOnce: true,
                    targets: [
                        {
                            src: "./src/bundle/Worker.js",
                            dest: "dist/tmp/widgets/com/mendix/shared"
                        }
                    ]
                })
            ];
        }
    });
    return result;
};
