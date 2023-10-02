import { Image, NativeModules, Platform } from "react-native";

export function retrieveImageFromNumber(numberImage: number): Promise<string> {
    const fs = NativeModules.RNFSManager ? require("react-native-fs") : null;

    return new Promise<string>((resolve, reject) => {
        if (Platform.OS === "android" && fs !== null) {
            const resolvedImage = Image.resolveAssetSource(numberImage).uri;
            const destinationPath = `${fs.CachesDirectoryPath}/${resolvedImage}.png`;
            fs.copyFileRes(resolvedImage + ".png", destinationPath)
                .then(() => {
                    resolve(`file://${destinationPath}`);
                })
                .catch((error: string) => {
                    console.error("Error copying file to " + destinationPath);
                    console.error("Error: " + error);
                    reject(error);
                });
        } else {
            resolve(Image.resolveAssetSource(numberImage).uri);
        }
    });
}
