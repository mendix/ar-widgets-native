import React, { createElement, Context, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
    Color3,
    DynamicTexture,
    Matrix,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Vector2,
    Vector3,
    VideoTexture
} from "@babylonjs/core";
import { WebARImageTrackerContainerProps } from "../typings/WebARImageTrackerProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { BrowserMultiFormatReader, NotFoundException, QRCodeReader, ResultPoint } from "@zxing/library";

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);

    const [imagetrackerParent, setImageTrackerParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [deviceID, setDeviceID] = useState<string>();
    const [resultsMap, setResultsMap] = useState<{ id: string; result: ResultPoint[] }[]>([]);
    const [cubes, setCubes] = useState<{ id: string; mesh: Mesh }[]>([]);

    useEffect(() => {
        let selectedDeviceId;
        const codeReader = new BrowserMultiFormatReader();
        codeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
                console.log(videoInputDevices);
                selectedDeviceId = videoInputDevices.find(input => input.label.includes("back"))?.deviceId;
                if (selectedDeviceId === null || selectedDeviceId === undefined) {
                    selectedDeviceId = videoInputDevices[0].deviceId;
                }
                setDeviceID(selectedDeviceId);
                codeReader.decodeFromVideoDevice(selectedDeviceId, null, (result, err) => {
                    if (result) {
                        setResultsMap(oldResults => {
                            if (oldResults.find(old => old.id === result.getText())) {
                                const changedResult = oldResults.slice(0);
                                let indexToChange: number | undefined;
                                changedResult.forEach((element, index) => {
                                    if (element.id === result.getText()) {
                                        indexToChange = index;
                                    }
                                });
                                if (indexToChange !== undefined) {
                                    changedResult[indexToChange] = {
                                        id: result.getText(),
                                        result: result.getResultPoints()
                                    };
                                }
                                return changedResult;
                            } else {
                                const newArray = [
                                    ...oldResults,
                                    { id: result.getText(), result: result.getResultPoints() }
                                ];
                                return newArray;
                            }
                        });
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
        console.log(resultsMap);
        resultsMap.forEach(result => {
            const foundIndex = cubes.findIndex(cube => cube.id === result.id);
            if (engineContext.scene) {
                var pickResult = engineContext.scene.pick(engineContext.scene.pointerX, engineContext.scene.pointerY);

                if (pickResult?.ray) {
                    if (foundIndex !== -1 && cubes[foundIndex].mesh) {
                        cubes[foundIndex].mesh.position = pickResult.ray.origin;
                    } else {
                        cubes[foundIndex].mesh = MeshBuilder.CreateBox("newbox", { size: 0.1 }, engineContext.scene);
                        cubes[foundIndex].mesh.position = pickResult.ray.origin;
                    }
                }
            }
        });
    }, [resultsMap]);

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
                height: 1,
                width: 1,
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
                    minWidth: 256 * 2,
                    minHeight: 256 * 2,
                    maxWidth: 256 * 2,
                    maxHeight: 256 * 2,
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
