import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";

export default args => {
    const result = args.configDefaultConfig;
    const dependencies = [
        "@babylonjs/core",
        "@babylonjs/loaders",
        "@babylonjs/react-native-iosandroid-0-70",
        "@babylonjs/react-native",
        "react-native-permissions",
        "tslib",
        "semver",
        "lru-cache",
        "yallist",
        "lodash",
        "base-64",
        "utf8",
        "react-native-fs"
    ];

    result.forEach(config => {
        config.external?.push(/^@babylonjs\/core($|\/)/);
        config.external?.push(/^semver/);
        config.external?.push(/^react-native-permissions/);
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            })
        );
    });

    result[0].plugins.push(
        copy({
            targets: dependencies.map(d => ({
                src: `../../node_modules/${d}/*`,
                dest: `dist/tmp/widgets/node_modules/${d}`
            })), 
        }),
        copy({
            targets:[{
                src: './ARContainer.json',
                dest: 'dist/tmp/widgets'
            }]
        })
    );

    return result;
};
