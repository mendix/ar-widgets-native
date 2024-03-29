import typescript from "@rollup/plugin-typescript";

export default args => {
    const result = args.configDefaultConfig;
    result.forEach(config => {
        config.external?.push(/^@babylonjs\/core($|\/)/);
        config.external?.push(/^react-native-fs/);
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            })
        );
    });
    return result;
};
