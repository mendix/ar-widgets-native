import React, { createElement, useState, useEffect, useRef, useContext, useCallback } from "react";
import { Mesh, MeshBuilder, PointerEventTypes, Ray, Vector3 } from "@babylonjs/core";
import { WebARImageTrackerContainerProps } from "../typings/WebARImageTrackerProps";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { BrowserMultiFormatReader } from "@zxing/library/cjs";
import Big from "big.js";

type ResultPoint = { x: number; y: number; estimatedModuleSize: number; count: number };
type PreviousResult = { id: string; mesh: Mesh; previousRays: Ray[] };

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const [newResult, setNewResult] = useState<{ id: string; result: ResultPoint[] }>();
    const [previousResults, setPreviousResults] = useState<PreviousResult[]>([]);
    const stopped = useRef<Boolean>(false);
    const scanning = useRef<Boolean>(false);
    const codeReaderRef = useRef<BrowserMultiFormatReader>();
    const streamRef = useRef<MediaStream>();
    const videoRef = useRef<HTMLVideoElement>();

    const returnWorker = useCallback(() => {
        return new Worker("widgets/com/mendix/shared/Worker.js");
    }, []);
    const createCaptureCanvas = useCallback(() => {
        return codeReaderRef.current!.createCaptureCanvas(videoRef.current);
    }, []);
    const callDecodeWorker = useCallback(() => {
        if (codeReaderRef.current && !stopped.current && videoRef.current) {
            const myWorker = returnWorker();
            myWorker.onmessage = event => {
                if (event.data !== null) {
                    setNewResult({ id: event.data[0], result: event.data[1] });
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
            myWorker.postMessage([captureCanvas.width, captureCanvas.height, imgData]);
        }
    }, []);
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

    function getAverageOfPoints(pointA: Vector3, pointB: Vector3) {
        return new Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2);
    }

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
        if (engineContext.scene && newResult) {
            const foundIndex = previousResults.findIndex(previousResult => previousResult.id === newResult.id);
            if (foundIndex > -1) {
                const previousResult = previousResults[foundIndex];
                const newResultPoints = newResult.result;
                let newRays: Ray[] = [];
                let combinedPoint: Vector3 | undefined = undefined;
                newResultPoints.forEach((point, index) => {
                    const newRay = engineContext.scene!.pick(point.x, point.y).ray;
                    const prevRay = previousResult.previousRays[index];
                    if (newRay) {
                        newRays.push(newRay);
                        const closestPoint = closestPointOnTwoLines(prevRay, newRay);
                        if (combinedPoint !== undefined) {
                            combinedPoint = getAverageOfPoints(combinedPoint, closestPoint);
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
                            oldresults[foundIndex].mesh.position = combinedPoint!;
                            oldresults[foundIndex].previousRays = newRays;
                            return oldresults;
                        });
                    }
                });
            } else {
                const rays: Ray[] = [];
                newResult.result.forEach(point => {
                    const newRay = engineContext.scene!.pick(point.x, point.y).ray;
                    if (newRay) {
                        rays.push(newRay);
                    }
                });
                const createResult: PreviousResult = {
                    mesh: MeshBuilder.CreateBox("newbox", { size: 0.1 }, engineContext.scene),
                    id: newResult.id,
                    previousRays: rays
                };
                setPreviousResults(prev => [...prev, createResult]);
            }
        }
    }, [newResult, engineContext.scene]);
}
