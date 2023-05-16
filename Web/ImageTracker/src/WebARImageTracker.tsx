import React, { createElement, Context, useState, useEffect, useRef, useContext, useCallback, MutableRefObject } from "react";
import {
    ActionManager,
    Color3,
    DynamicTexture,
    Matrix,
    Mesh,
    MeshBuilder,
    PointerEventTypes,
    Ray,
    RayHelper,
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
    let canvasRef = useRef<HTMLCanvasElement | null>(null);
    let codeReaderRef = useRef<BrowserMultiFormatReader>();
    let videoRef = useRef<HTMLVideoElement>();

    const [imagetrackerParent, setImageTrackerParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [resultsMap, setResultsMap] = useState<{ id: string; result: ResultPoint[] }[]>([]);
    const [cubes, setCubes] = useState<{ id: string; mesh: Mesh; previousRays: Ray[] }[]>([]);
    const scale = 0.5;
    const stopped = useRef<Boolean>(false);
    
    const ClosestPointOnTwoLines = (ray1: Ray, ray2: Ray): Vector3 => {
        const lineVec1: Vector3 = ray1.direction;
        const lineVec2: Vector3 = ray2.direction;
        const linePoint1: Vector3 = ray1.origin;
        const linePoint2: Vector3 = ray2.origin;
    
        const a = Vector3.Dot(lineVec1, lineVec1);
        const b = Vector3.Dot(lineVec1, lineVec2);
        const e = Vector3.Dot(lineVec2, lineVec2);
        const d = a * e - b * b;
        if (d !== 0.0) {
          const r = linePoint1.subtract(linePoint2);
          const c = Vector3.Dot(lineVec1, r);
          const f = Vector3.Dot(lineVec2, r);
          const s = (b * f - c * e) / d;
          const t = (a * f - c * b) / d;
          const resultLine1 = linePoint1.add(lineVec1.scale(s));
          const resultLine2 = linePoint2.add(lineVec2.scale(t));
          const result: Vector3 = resultLine1.add(resultLine2).scale(0.5);
          return result;
        } else {
          return Vector3.Zero();
        }
      };

    const scanWithCropOnce = (reader: BrowserMultiFormatReader, videoRef: HTMLVideoElement): Promise<Result> => {
        const cropWidth = videoRef!.videoWidth * scale;
        const captureCanvas = reader.createCaptureCanvas(videoRef!);
        captureCanvas.width = cropWidth;
        captureCanvas.height = cropWidth;
        const loop = (resolve: (value: Result) => void, reject: (reason?: Error) => void) => {
            try {
                console.log("stopped: " + stopped.current);
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
                    canvasRef.current?.getContext("2d")?.drawImage(
                        videoRef!,
                        (videoRef!.videoWidth * (1 - scale)) / 2,
                        (videoRef!.videoHeight - cropWidth) / 2,
                        cropWidth,
                        cropWidth,
                        0,
                        0,
                        captureCanvas.width,
                        captureCanvas.width)
                        console.log(canvasRef.current?.getContext("2d")?.getImageData(10,10,1,1))
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
        codeReaderRef.current = codeReader;


        let videoElement = document.createElement("video");
        videoRef.current = videoElement;

        const stop = (): void => {
            stopped.current = true;
            codeReader.stopAsyncDecode();
            codeReader.reset();
        };

        const start = async (): Promise<void> => {
            let stream;

            // try {
            //     stream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
            //     codeReader.timeBetweenDecodingAttempts = 500;
                
            //     if (videoElement) {
            //         videoElement.srcObject = stream;
            //         videoElement.autofocus = true;
            //         videoElement.playsInline = true; // Fix error in Safari
            //         await videoElement.play();
            //     //     while (!stopped.current) {
                        
            //     //         // const result = await scanWithCropOnce(codeReader, videoElement);
                       
            //     //     }
            //     }
            // } catch (error) {
            //     // Suppress not found error if widget is closed normally (eg. leaving page);
            //     const isNotFound = error instanceof NotFoundException;
            //     if (!isNotFound && !stopped.current) {
            //         if (error instanceof Error) {
            //             console.error(error.message);
            //         }
            //     }
            // } finally {
            //     stop();
            //     stream?.getVideoTracks().forEach(track => track.stop());
            // }
        };
        start();

        return () => {
            stop();
            codeReader.stopAsyncDecode();
        };
    }, []);

    useEffect(() => {
        if(engineContext.scene){
            const scan = async () => {
                if(codeReaderRef.current && videoRef.current && stopped.current){
                    stopped.current = false;
                const mediaStreamConstraints: MediaStreamConstraints = {
                    audio: false,
                    video: {
                        facingMode: "environment",
                        width: { min: 1280, ideal: 1920, max: 2560 },
                        height: { min: 720, ideal: 1080, max: 1440 }
                    }
                };
                let stream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
                codeReaderRef.current.timeBetweenDecodingAttempts = 500;
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.autofocus = true;
                    videoRef.current.playsInline = true; // Fix error in Safari
                    
                    await videoRef.current.play();
               
                const result = await codeReaderRef.current.decodeOnce(videoRef.current)
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
                codeReaderRef.current?.stopAsyncDecode();
                codeReaderRef.current?.reset();
                videoRef.current.pause();
                stream?.getVideoTracks().forEach(track => track.stop());
                stopped.current = true;   
            }}

            engineContext.scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                  case PointerEventTypes.POINTERDOWN:
                    console.log("POINTERDOWN")
                    scan();
                    break;
                }
            });
        }
    }, [])

    useEffect(() => {
        resultsMap.forEach(result => {
            const foundIndex = cubes.findIndex(cube => cube.id === result.id);
            if (engineContext.scene) {
                var rays: Ray[] = [];
                result.result.forEach((point, index) => {
                    const ray = engineContext.scene!.pick(point.getX(), point.getY())
                    if(ray?.ray){
                        rays[index] = ray.ray;
                    }
                });
                if (rays.length !== 0) {
                    if (foundIndex !== -1 && cubes[foundIndex].mesh) {
                        rays.forEach((currentRay, index) => {
                            const closestPoint =  ClosestPointOnTwoLines( cubes[foundIndex].previousRays[index], currentRay);
                            if(closestPoint !== Vector3.Zero()) {
                                setCubes(oldcubes => {
                                    oldcubes[foundIndex].mesh.position = closestPoint;
                                    oldcubes[foundIndex].previousRays[index] = currentRay;
                                    return oldcubes;
                                });
                            }
                        });
                    } else {
                        const newCubes = cubes.slice(0);
                        const newCube = {
                            mesh: MeshBuilder.CreateBox("newbox", { size: 0.1 }, engineContext.scene),
                            id: result.id,
                            previousRays: rays
                        };
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
        <canvas ref={canvasRef} width="300" height="300"/>
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
