export default args => {
    const result = args.configDefaultConfig;
    result.forEach(config => {
        config.external?.push(/^@babylonjs\/core($|\/)/);
    });
    return result;
};
