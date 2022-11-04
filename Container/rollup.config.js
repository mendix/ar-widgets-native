import copy from "rollup-plugin-copy";

export default args => {
    const result = args.configDefaultConfig;
    const dependencies = ["@babylonjs/core", "@babylonjs/loaders", "react-native-permissions"];
    result.forEach(config => {
        config.external?.push(/^@babylonjs\/core($|\/)/);
        config.external?.push(/^semver/);
        config.external?.push(/^react-native-permissions/);
    });
    result[0].plugins.push(
        copy({
            targets: dependencies.map(d => ({
                src: `../node_modules/${d}/*`,
                dest: `dist/tmp/widgets/node_modules/${d}`
            }))
        })
    );
    return result;
};
