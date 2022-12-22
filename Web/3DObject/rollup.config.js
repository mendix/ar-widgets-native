import typescript from "@rollup/plugin-typescript";
import fs from "fs";

export default args => {
    const result = args.configDefaultConfig;
    result.treeshake = false;
    result.forEach(config => {
        const external = [/^@babylonjs\/core($|\/)/];
        config.external = [...config.external, ...external];
        config.plugins.push(
            typescript({
                include: ["../../Shared/ComponentParent/**/*.ts+(|x)", "./**/*.ts+(|x)"]
            }),
            {
                writeBundle(bundle) {
                    for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
                        if (
                            chunkOrAsset !== undefined &&
                            (chunkOrAsset.toString().endsWith(".js") || chunkOrAsset.toString().endsWith(".mjs")) &&
                            fileName === "file"
                        ) {
                            const data = fs.readFileSync(chunkOrAsset, { encoding: "utf8" });
                            const regex = /@babylonjs\/core\/.*?\.js/g;
                            fs.writeFileSync(chunkOrAsset, data.replaceAll(regex, "../../../shared/babylonjscore"));
                        }
                    }
                }
            }
        );
        config.output.paths = {
            ...config.output.paths,
            "@babylonjs/core": "../../../shared/babylonjscore.js"
        };
    });

    return result;
};
