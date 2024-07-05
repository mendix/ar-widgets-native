import { createDraft, publishDraft } from "./api/contributor";
import { Version } from "./api/utils/version";

function CreateDraftInMarketplace() {
    if (process.env.MODULE_VERSION?.startsWith("web")) {
        console.error("release tag for something other than web, currently not implemented");
        return;
    }

    const version = process.env.MODULE_VERSION?.split("v").pop();
    if (version === undefined) {
        console.error("No version in tag: " + process.env.MODULE_VERSION);
        return;
    }
    const appversion: Version = Version.fromString(version);
    const studioProVersion: Version = new Version(9, 21, 2);
    const result = createDraft({
        appName: "WebXR Widgets",
        appNumber: 203481, //number in marketplace
        version: appversion,
        studioProVersion: studioProVersion,
        artifactUrl: `https://github.com/HedwigAR/ar-widgets-native/releases/download/${process.env.MODULE_VERSION}/WebXRWidgets.mpk` //link to github mpk
    });
    result.then(success => {
        console.log(success);
        publishDraft({ draftUUID: success.UUID });
    });
    result.catch(rejected => {
        console.log(rejected);
    });
}

CreateDraftInMarketplace();
