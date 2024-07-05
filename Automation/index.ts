import { createDraft, publishDraft } from "./api/contributor";
import { Version } from "./api/utils/version";

function CreateDraftInMarketplace() {
    console.log(process.env.MODULE_VERSION);
    // const appversion: Version = new Version(0, 0, 3);
    // const studioProVersion: Version = new Version(9, 21, 2);
    // const result = createDraft({
    //     appName: "WebXR Widgets",
    //     appNumber: 203481, //number in marketplace
    //     version: appversion,
    //     studioProVersion: studioProVersion,
    //     artifactUrl: "https://github.com/HedwigAR/ar-widgets-native/releases/download/web-v0.0.3/WebXRWidgets.mpk" //link to github mpk
    // });
    // result.then(success => {
    //     console.log(success);
    //     publishDraft({ draftUUID: success.UUID });
    // });
    // result.catch(rejected => {
    //     console.log(rejected);
    // });
}

CreateDraftInMarketplace();
