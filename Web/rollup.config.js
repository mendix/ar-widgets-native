import typescript from "@rollup/plugin-typescript";
import rollupJson from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";

export default args => {
    const result = args.configDefaultConfig;
    result.forEach(config => {
        const external = [/^@babylonjs\/core($|\/)/];
        config.external = [...config.external, ...external];
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            }),
            commonjs(),
            rollupJson()
        );
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": "../../../shared/babylonjscore.js"
        };
    });
    return result;
};
