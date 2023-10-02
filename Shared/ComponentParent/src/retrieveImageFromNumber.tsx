import { Image, NativeModules, Platform } from "react-native";

export function retrieveImageFromNumber(numberImage: number): Promise<string> {
    const fs = NativeModules.RNFSManager ? require("react-native-fs") : null;

    return new Promise<string>((resolve, reject) => {
        if (Platform.OS === "android" && fs !== null) {
            const resolvedImage = Image.resolveAssetSource(numberImage).uri;
            const destinationPath = `${fs.CachesDirectoryPath}/${resolvedImage}`;

            fs.exists(destinationPath)
                .then((fileExists: boolean) => {
                    if (fileExists) {
                        resolve(`file://${destinationPath}`);
                    } else {
                        fs.copyFileRes(resolvedImage + ".png", destinationPath)
                            .then(() => {
                                resolve(`file://${destinationPath}`);
                            })
                            .catch((error: string) => {
                                console.error("Error copying file to " + destinationPath);
                                reject(error);
                            });
                    }
                })
                .catch((error: any) => {
                    reject(error);
                });
        } else {
            console.error("using old way of retrieving file");
            resolve(Image.resolveAssetSource(numberImage).uri);
        }
    });
}
