import React, { createElement, Context, useState, useEffect, useRef, useContext, useCallback } from "react";
import { IWebXRAnchor, Mesh, MeshBuilder, PointerEventTypes, Ray, Vector3 } from "@babylonjs/core";
import { WebARImageTrackerContainerProps } from "../typings/WebARImageTrackerProps";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { BrowserMultiFormatReader } from "@zxing/library/cjs";
import Big from "big.js";

type ResultPoint = { x: number; y: number; estimatedModuleSize: number; count: number };
type Cube = { id: string; mesh: Mesh; previousRays: Ray[]; anchor?: IWebXRAnchor };

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const [resultsMap, setResultsMap] = useState<{ id: string; result: ResultPoint[] }[]>([]);
    const [cubes, setCubes] = useState<Cube[]>([]);
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
                    handleResult(event.data[0], event.data[1]);
                }
                myWorker.terminate();
                if (scanning.current && !stopped.current) {
                    callDecodeWorker();
                } else {
                    console.log("Stopping loop");
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
                console.log("Error while creating stream: " + reason);
                stopped.current = true;
            });
    }, []);

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

    const handleResult = (text: string, resultPoints: ResultPoint[]) => {
        setResultsMap(oldResults => {
            if (oldResults.find(old => old.id === text)) {
                const changedResult = [...oldResults];
                const indexToChange = oldResults.findIndex(element => element.id === text);
                if (indexToChange !== -1) {
                    changedResult[indexToChange].result = resultPoints;
                }
                return changedResult;
            } else {
                const newArray = [...oldResults, { id: text, result: resultPoints }];
                return newArray;
            }
        });
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
        resultsMap.forEach(result => {
            const foundIndex = cubes.findIndex(cube => cube.id === result.id);
            if (engineContext.scene) {
                var rays: Ray[] = [];
                let combinedPosition: Vector3 | undefined = undefined;
                result.result.forEach((point, index) => {
                    const ray = engineContext.scene!.pick(point.x, point.y);
                    if (ray?.ray) {
                        rays[index] = ray.ray;
                        if (foundIndex > -1) {
                            const closestPoint = ClosestPointOnTwoLines(cubes[foundIndex].previousRays[index], ray.ray);
                            if (combinedPosition === undefined) {
                                combinedPosition = closestPoint;
                            } else {
                                combinedPosition = getAverageOfPoints(combinedPosition, closestPoint);
                            }
                            if (index === result.result.length - 1) {
                                setCubes(oldcubes => {
                                    oldcubes[foundIndex].mesh.position = combinedPosition!;
                                    oldcubes[foundIndex].previousRays[index] = ray.ray!;
                                    return oldcubes;
                                });

                                props.ScannedResult.setValue(result.id);
                                const preciseX = combinedPosition.x.toPrecision(4);
                                const preciseY = combinedPosition.y.toPrecision(4);
                                const preciseZ = combinedPosition.z.toPrecision(4);

                                props.X.setValue(Big(preciseX.includes("e") ? 0 : preciseX));
                                props.Y.setValue(Big(preciseY.includes("e") ? 0 : preciseY));
                                props.Z.setValue(Big(preciseZ.includes("e") ? 0 : preciseZ));

                                props.mxOnDataChanged?.canExecute && !props.mxOnDataChanged.isExecuting
                                    ? props.mxOnDataChanged.execute()
                                    : null;
                                console.log(props.ScannedResult.validation);
                            }
                        }
                    }
                });
                if (foundIndex === -1 && rays.length !== 0) {
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
        });
    }, [resultsMap]);
}
