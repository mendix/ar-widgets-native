import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default args => {
    const result = args.configDefaultConfig;
    result.forEach((config, index) => {
        const external = [/^@babylonjs\/core($|\/)/];

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
                            src: "./src/bundle/babylonjscore.js",
                            dest: "dist/tmp/widgets/com/mendix/shared"
                        },
                        {
                            src: "./src/bundle/babylonjscore.amd.js", 
                            dest: "dist/tmp/widgets/com/mendix/shared"
                        },
                    ]
                })
            ];
        }
        
        // Dynamic path mapping based on output format
        const isAMD = config.output.format === "amd";
        const babylonPath = isAMD ? "../../../shared/babylonjscore.amd" : "../../../shared/babylonjscore";
        
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": babylonPath,
            "@babylonjs/core/Engines/engine.js": babylonPath,
            "@babylonjs/core/scene.js": babylonPath,
        };
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            })
        );
    });
    return result;
};
