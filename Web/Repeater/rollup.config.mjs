import typescript from "@rollup/plugin-typescript";

export default args => {
    const result = args.configDefaultConfig;
    result.forEach(config => {
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            })
        );
    });
    return result;
};
