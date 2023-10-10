import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

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

    result[0].plugins.push(
        copy({
            targets: [
                {
                    src: "./ARImageTracker.json",
                    dest: "dist/tmp/widgets"
                }
            ]
        })
    );
    return result;
};
