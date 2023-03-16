import typescript from "@rollup/plugin-typescript";
const copy = require("rollup-plugin-copy");

export default args => {
    const result = args.configDefaultConfig;
    result.forEach((config, index) => {
        const external = [/^@babylonjs\/core($|\/)/, /^html5-qrcode($|\/)/];

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
                            src: "./src/bundle/htmlqrcode.js",
                            dest: "dist/tmp/widgets/com/mendix/shared"
                        }
                    ]
                })
            ];
        }
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": "../../../shared/babylonjscore.js",
            "@babylonjs/core/Engines/engine.js": "../../../shared/babylonjscore.js",
            "@babylonjs/core/scene.js": "../../../shared/babylonjscore.js",
            "html5-qrcode": "../../../shared/htmlqrcode.js"
        };
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            })
        );
    });
    return result;
};
