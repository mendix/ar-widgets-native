import React, { createElement, useState, useEffect, useRef, useContext, useCallback } from "react";
import { PointerEventTypes, Ray, Scene, UniversalCamera, Vector3, WebXRCamera } from "@babylonjs/core";
import { WebXRImageTrackerContainerProps } from "../typings/WebXRImageTrackerProps";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { BrowserMultiFormatReader } from "@zxing/library/cjs";
import Big from "big.js";

type ResultPoint = { x: number; y: number; estimatedModuleSize: number; count: number };
type PreviousResult = { id: string; position: Vector3 | undefined; previousRays: Ray[] };

export function WebXRImageTracker(props: WebXRImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const [newResult, setNewResult] = useState<{ id: string; result: ResultPoint[]; camera: UniversalCamera }>();
    const [previousResults, setPreviousResults] = useState<PreviousResult[]>([]);
    const stopped = useRef<Boolean>(false);
    const scanning = useRef<Boolean>(false);
    const codeReaderRef = useRef<BrowserMultiFormatReader>();
    const streamRef = useRef<MediaStream>();
    const videoRef = useRef<HTMLVideoElement>();
    const engineContextCamera = useRef<WebXRCamera>();
    const clonedCamera = useRef<UniversalCamera>();
    const sceneRef = useRef<Scene>();
    const lastPosition = useRef<Vector3>();

    const returnWorker = useCallback(() => {
        return new Worker("widgets/com/mendix/shared/Worker.js");
    }, []);
    const createCaptureCanvas = useCallback(() => {
        return codeReaderRef.current!.createCaptureCanvas(videoRef.current);
    }, []);
    const callDecodeWorker = () => {
        if (
            codeReaderRef.current &&
            !stopped.current &&
            videoRef.current &&
            sceneRef.current &&
            (engineContextCamera.current !== undefined || sceneRef.current?.activeCamera !== (undefined || null))
        ) {
            const cameraToClone = engineContextCamera.current ?? sceneRef.current.activeCamera;
            if (clonedCamera.current && lastPosition.current) {
                const distance = Vector3.Distance(cameraToClone!.position, lastPosition.current);
            }
            if (
                !lastPosition.current ||
                clonedCamera.current === undefined ||
                Vector3.Distance(cameraToClone!.position, lastPosition.current) > 0.1
            ) {
                const myWorker = returnWorker();
                myWorker.onmessage = event => {
                    if (event.data !== null) {
                        lastPosition.current = clonedCamera.current!.position.clone();
                        const ResultPoints: ResultPoint[] = event.data[1];
                        ResultPoints.forEach(point => {
                            point.y -= 125;
                        });
                        setNewResult({ id: event.data[0], result: ResultPoints, camera: clonedCamera.current! });
                    } else {
                        clonedCamera.current?.dispose();
                    }
                    myWorker.terminate();
                    if (scanning.current && !stopped.current) {
                        callDecodeWorker();
                    } else {
                        stopped.current = true;
                    }
                };
                const captureCanvas = createCaptureCanvas();
                captureCanvas?.getContext("2d")?.drawImage(videoRef.current, 0, 0);
                const imgData = captureCanvas
                    ?.getContext("2d")
                    ?.getImageData(0, 0, videoRef.current.width, videoRef.current.height);
                if (clonedCamera.current !== undefined) {
                    clonedCamera.current.dispose();
                }
                myWorker.postMessage([captureCanvas.width, captureCanvas.height, imgData]);
                clonedCamera.current = new UniversalCamera(
                    "clonedCamera",
                    cameraToClone!.position.clone(),
                    sceneRef.current
                );
                clonedCamera.current.rotationQuaternion = cameraToClone!.absoluteRotation.clone();
            } else {
                setTimeout(() => {
                    if (!stopped.current && scanning.current) callDecodeWorker();
                }, 250);
            }
        }
    };

    useEffect(() => {
        if (engineContext.camera) {
            engineContextCamera.current = engineContext.camera;
        }
    }, [engineContext.camera]);

    const startStream = useCallback(() => {
        const mediaStreamConstraints: MediaStreamConstraints = {
            audio: false,
            video: {
                facingMode: "environment",
                width: { min: 1280, ideal: 1920, max: 2560 },
                height: { min: 720, ideal: 1080, max: 1440 }
            }
        };
        navigator.mediaDevices
            .getUserMedia(mediaStreamConstraints)
            .then(stream => {
                if (codeReaderRef.current) {
                    streamRef.current = stream;
                    const video = document.createElement("video");
                    let { width, height } = stream.getTracks()[0].getSettings();
                    if (width) video.width = width;
                    if (height) video.height = height;
                    video.srcObject = streamRef.current;
                    video.play().then(() => {
                        videoRef.current = video;
                        stopped.current = false;
                        callDecodeWorker();
                    });
                }
            })
            .catch(reason => {
                console.error("Error while creating stream: " + reason);
                stopped.current = true;
            });
    }, []);

    const closestPointOnTwoLines = (ray1: Ray, ray2: Ray): Vector3 => {
        if (ray1 === undefined || ray2 === undefined) {
            return Vector3.Zero();
        } else {
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
        }
    };

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        return () => {
            stopped.current = true;
            codeReader.stopAsyncDecode();
            codeReader.reset();
            streamRef.current?.getVideoTracks().forEach(track => {
                track.stop();
            });
        };
    }, []);

    useEffect(() => {
        if (engineContext.scene) {
            sceneRef.current = engineContext.scene;
            engineContext.scene.onPointerObservable.add(pointerInfo => {
                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN:
                        scanning.current = !scanning.current;
                        if (scanning.current) {
                            startStream();
                        } else {
                            streamRef.current?.getVideoTracks().forEach(track => {
                                track.stop();
                            });
                        }
                        break;
                }
            });
        }
    }, [engineContext.scene, codeReaderRef.current]);

    useEffect(() => {
        if (sceneRef.current && newResult) {
            const foundIndex = previousResults.findIndex(previousResult => previousResult.id === newResult.id);

            if (foundIndex > -1) {
                const previousResult = previousResults[foundIndex];
                const newResultPoints = newResult.result;
                let newRays: Ray[] = [];
                let combinedPoint: Vector3 | undefined = undefined;
                newResultPoints.forEach((point, index) => {
                    if (newResult.camera) {
                        const newRay = sceneRef.current!.pick(point.x, point.y, undefined, false, newResult.camera).ray;
                        if (newRay) {
                            newRay.origin = newResult.camera.position.clone();

                            const prevRay = previousResult.previousRays[index];
                            if (newRay) {
                                newRays.push(newRay);
                                const closestPoint = closestPointOnTwoLines(prevRay, newRay);
                                if (combinedPoint !== undefined) {
                                    combinedPoint = combinedPoint.add(closestPoint).scale(0.5);
                                } else {
                                    combinedPoint = closestPoint;
                                }
                            }
                            if (index === newResultPoints.length - 1 && combinedPoint) {
                                const preciseX = combinedPoint.x.toPrecision(4);
                                const preciseY = combinedPoint.y.toPrecision(4);
                                const preciseZ = combinedPoint.z.toPrecision(4);
                                props.mxScannedResult.setValue(newResult.id);
                                props.mxPositionX.setValue(Big(preciseX.includes("e") ? 0 : preciseX));
                                props.mxPositionY.setValue(Big(preciseY.includes("e") ? 0 : preciseY));
                                props.mxPositionZ.setValue(Big(preciseZ.includes("e") ? 0 : preciseZ));
                                props.mxOnDataChanged?.canExecute && !props.mxOnDataChanged.isExecuting
                                    ? props.mxOnDataChanged.execute()
                                    : null;
                                setPreviousResults(oldresults => {
                                    oldresults[foundIndex].position = combinedPoint!;
                                    oldresults[foundIndex].previousRays = newRays;
                                    return oldresults;
                                });
                            }
                        }
                    }
                });
            } else {
                const rays: Ray[] = [];
                newResult.result.forEach(point => {
                    const newRay = sceneRef.current!.pick(point.x, point.y, undefined, false, newResult.camera).ray;
                    if (newRay) {
                        rays.push(newRay);
                    }
                });
                const createResult: PreviousResult = {
                    position: undefined,
                    id: newResult.id,
                    previousRays: rays
                };
                setPreviousResults(prev => [...prev, createResult]);
            }
            newResult.camera?.dispose();
        }
    }, [newResult, engineContext.scene]);
}
