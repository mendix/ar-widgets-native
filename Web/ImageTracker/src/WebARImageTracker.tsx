import React, { createElement, Context, useState, useEffect, useRef, useContext } from "react";
import {
    Color3,
    DynamicTexture,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector3,
    VideoTexture
} from "@babylonjs/core";
import { WebARImageTrackerContainerProps } from "../typings/WebARImageTrackerProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import {
    MultiFormatReader,
    BarcodeFormat,
    DecodeHintType,
    RGBLuminanceSource,
    BinaryBitmap,
    HybridBinarizer,
    BrowserMultiFormatReader,
    NotFoundException
} from "@zxing/library";

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const [imagetrackerParent, setImageTrackerParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [deviceID, setDeviceID] = useState<string>();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let selectedDeviceId;
        const codeReader = new BrowserMultiFormatReader();
        console.log("ZXing code reader initialized");
        codeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
                console.log(videoInputDevices);
                selectedDeviceId = videoInputDevices[0].deviceId;
                // if (videoInputDevices.length >= 1) {
                //     videoInputDevices.forEach(element => {
                //         const sourceOption = document.createElement("option");
                //         sourceOption.text = element.label;
                //         sourceOption.value = element.deviceId;
                //     });
                // }
                setDeviceID(selectedDeviceId);
                codeReader.decodeFromVideoDevice(selectedDeviceId, null, (result, err) => {
                    if (result) {
                        console.log(result);
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        console.error(err);
                    }
                });

                console.log(`Started continous decode from camera with id ${selectedDeviceId}`);
            })
            .catch(err => {
                console.error(err);
            });
        return () => {
            codeReader.stopAsyncDecode();
        };
    }, []);

    useEffect(() => {
        if (engineContext?.scene) {
            const localImageTracker = new Mesh(props.name, engineContext?.scene);
            setImageTrackerParent(localImageTracker);
            setParentID(localImageTracker.uniqueId);
        }
    }, [engineContext]);

    useEffect(() => {
        if (engineContext?.scene && deviceID) {
            var planeOpts = {
                height: 5.4762,
                width: 7.3967,
                sideOrientation: Mesh.DOUBLESIDE
            };
            console.log("Create plane wiith video!");
            var ANote0Video = MeshBuilder.CreatePlane("plane", planeOpts, engineContext?.scene);
            var vidPos = new Vector3(0, 0, 1);
            ANote0Video.position = vidPos;
            var ANote0VideoMat = new StandardMaterial("m", engineContext?.scene);
            VideoTexture.CreateFromWebCam(
                engineContext?.scene,
                function (videoTexture) {
                    ANote0VideoMat.diffuseTexture = videoTexture;
                },
                {
                    minWidth: 256,
                    minHeight: 256,
                    maxWidth: 256,
                    maxHeight: 256,
                    deviceId: deviceID
                }
            );
            ANote0Video.material = ANote0VideoMat;
        }
    }, [engineContext?.scene, deviceID]);

    return (
        <>
            <div id="reader" />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
