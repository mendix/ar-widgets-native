import { createDraft, CreateDraftSuccessResponse, publishDraft } from "./api/contributor";
import { Version } from "./api/utils/version";

function CreateDraftWeb(appVersion: Version): Promise<CreateDraftSuccessResponse> {
    const studioProVersion: Version = new Version(9, 21, 2);
    const result = createDraft({
        appName: "WebXR Widgets",
        appNumber: 203481, //number in marketplace
        version: appVersion,
        studioProVersion: studioProVersion,
        artifactUrl: `https://github.com/mendix/ar-widgets-native/releases/download/${process.env.MODULE_VERSION}/WebXRWidgets.mpk` //link to github mpk
    });
    return result;
}

function CreateDraftNative(appVersion: Version): Promise<CreateDraftSuccessResponse> {
    const studioProVersion: Version = new Version(10, 0, 0);
    const result = createDraft({
        appName: "Native Mobile AR",
        appNumber: 117209, //number in marketplace
        version: appVersion,
        studioProVersion: studioProVersion,
        artifactUrl: `https://github.com/mendix/ar-widgets-native/releases/download/${process.env.MODULE_VERSION}/NativeMobileAR.mpk` //link to github mpk
    });
    return result;
}

function CreateDraftAndPublish() {
    const version = process.env.MODULE_VERSION?.split("v").pop();
    if (version === undefined || process.env.MODULE_VERSION === undefined) {
        console.error("No version in tag: " + process.env.MODULE_VERSION);
        return;
    }
    const appVersion: Version = Version.fromString(version);
    let result: Promise<CreateDraftSuccessResponse>;
    if (process.env.MODULE_VERSION.startsWith("web")) {
        result = CreateDraftWeb(appVersion);
    } else if (process.env.MODULE_VERSION?.startsWith("native")) {
        result = CreateDraftNative(appVersion);
    } else {
        console.error("Unexpected version in tag: " + process.env.MODULE_VERSION);
        return;
    }

    result.then(success => {
        console.log(success);
        publishDraft({ draftUUID: success.UUID });
    });
    result.catch(rejected => {
        console.log(rejected);
    });
}

CreateDraftAndPublish();
