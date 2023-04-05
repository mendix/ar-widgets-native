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
import {
    BinaryBitmap,
    BrowserMultiFormatReader,
    HTMLCanvasElementLuminanceSource,
    HybridBinarizer,
    NotFoundException,
    QRCodeReader,
    Result,
    ResultPoint
} from "@zxing/library/cjs";

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);

    const [imagetrackerParent, setImageTrackerParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [resultsMap, setResultsMap] = useState<{ id: string; result: ResultPoint[] }[]>([]);
    const [cubes, setCubes] = useState<{ id: string; mesh: Mesh }[]>([]);
    const [videoElement, setVideoElement] = useState<HTMLVideoElement>();
    const scale = 0.3;
    const stopped = useRef<Boolean>(false);
    const scanWithCropOnce = (reader: BrowserMultiFormatReader, videoRef: HTMLVideoElement): Promise<Result> => {
        const cropWidth = videoRef!.videoWidth * scale;
        const captureCanvas = reader.createCaptureCanvas(videoRef!);
        captureCanvas.width = cropWidth;
        captureCanvas.height = cropWidth;
        const loop = (resolve: (value: Result) => void, reject: (reason?: Error) => void) => {
            try {
                const canvasContext = captureCanvas.getContext("2d");
                if (canvasContext !== null) {
                    canvasContext.drawImage(
                        videoRef!,
                        (videoRef!.videoWidth * (1 - scale)) / 2,
                        (videoRef!.videoHeight - cropWidth) / 2,
                        cropWidth,
                        cropWidth,
                        0,
                        0,
                        captureCanvas.width,
                        captureCanvas.width
                    );
                    const luminanceSource = new HTMLCanvasElementLuminanceSource(captureCanvas);
                    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
                    const result = reader.decodeBitmap(binaryBitmap);
                    resolve(result);
                }
            } catch (error: any) {
                if (error instanceof NotFoundException && !stopped.current) {
                    console.log("Not found");
                    setTimeout(() => loop(resolve, reject), reader.timeBetweenDecodingAttempts);
                } else {
                    reject(error);
                }
            }
        };
        return new Promise(loop);
    };

    useEffect(() => {
        stopped.current = false;
        const codeReader = new BrowserMultiFormatReader();
        const mediaStreamConstraints: MediaStreamConstraints = {
            audio: false,
            video: {
                facingMode: "environment",
                width: { min: 1280, ideal: 1920, max: 2560 },
                height: { min: 720, ideal: 1080, max: 1440 }
            }
        };

        let videoRef = document.createElement("video");
        setVideoElement(videoRef);

        const stop = (): void => {
            stopped.current = true;
            codeReader.stopAsyncDecode();
            codeReader.reset();
        };

        const start = async (): Promise<void> => {
            let stream;

            try {
                stream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
                codeReader.timeBetweenDecodingAttempts = 500;

                if (videoRef) {
                    videoRef.srcObject = stream;
                    videoRef.autofocus = true;
                    videoRef.playsInline = true; // Fix error in Safari
                    await videoRef.play();
                    while (!stopped.current) {
                        const result = await scanWithCropOnce(codeReader, videoRef);
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
                }
            } catch (error) {
                // Suppress not found error if widget is closed normally (eg. leaving page);
                const isNotFound = error instanceof NotFoundException;
                if (!isNotFound && !stopped.current) {
                    if (error instanceof Error) {
                        console.error(error.message);
                    }
                }
            } finally {
                stop();
                stream?.getVideoTracks().forEach(track => track.stop());
            }
        };
        start();

        return () => {
            stop();
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
                        console.log(cubes[foundIndex].mesh.position);
                        cubes;
                        setCubes(oldcubes => {
                            oldcubes[foundIndex].mesh.position = pickResult!.ray!.origin;
                            return oldcubes;
                        });
                    } else {
                        const newCubes = cubes.slice(0);
                        const newCube = {
                            mesh: MeshBuilder.CreateBox("newbox", { size: 0.1 }, engineContext.scene),
                            id: result.id
                        };
                        newCube.mesh.position = pickResult.ray.origin;
                        newCubes.push(newCube);
                        setCubes(newCubes);
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

    return (
        <>
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
