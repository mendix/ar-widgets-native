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
        
        // Dynamic path mapping based on output format
        const isAMD = config.output.format === "amd";
        const babylonPath = isAMD ? "../../../shared/babylonjscore.amd" : "../../../shared/babylonjscore";
        
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": babylonPath
        };
    });
    return result;
};
