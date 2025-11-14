import typescript from "@rollup/plugin-typescript";
import rollupJson from "@rollup/plugin-json";

export default args => {
    const result = args.configDefaultConfig;
    result.forEach(config => {
        const external = [/^@babylonjs\/core($|\/)/];
        config.external = [...config.external, ...external];
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            }),
            rollupJson()
        );
        
        // Use ES modules for React mode, UMD for Dojo mode
        const isDojo = config.output.format === "amd";
        const babylonPath = isDojo ? "../../../shared/babylonjscore.umd" : "../../../shared/babylonjscore";
        
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": babylonPath
        };
    });
    return result;
};
