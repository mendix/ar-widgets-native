import React, { createElement, Context, useState, useEffect, useRef, useContext, useCallback } from "react";
import { Mesh, MeshBuilder, PointerEventTypes, Ray, Vector3 } from "@babylonjs/core";
import { WebARImageTrackerContainerProps } from "../typings/WebARImageTrackerProps";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { BrowserMultiFormatReader, Result } from "@zxing/library/cjs";

type ResultPoint = { x: number; y: number; estimatedModuleSize: number; count: number };

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    let codeReaderRef = useRef<BrowserMultiFormatReader>();
    let streamRef = useRef<MediaStream>();
    // let canvasRef = useRef<HTMLCanvasElement>(null);
    let videoRef = useRef<HTMLVideoElement>();

    const [parentID, setParentID] = useState<number>(NaN);
    const [resultsMap, setResultsMap] = useState<{ id: string; result: ResultPoint[] }[]>([]);
    const [cubes, setCubes] = useState<{ id: string; mesh: Mesh; previousRays: Ray[] }[]>([]);
    const [startLoopTrack, setStartLoopTrack] = useState<boolean>(false);
    const stopped = useRef<Boolean>(false);
    const returnWorker = useCallback(() => {
        return new Worker("widgets/com/mendix/shared/Worker.js");
    }, []);
    const scanning = useRef<Boolean>(false);
    const createCaptureCanvas = useCallback(() => {
        return codeReaderRef.current!.createCaptureCanvas(videoRef.current);
    }, []);

    let workerRequire = require("./bundle/Worker.js");

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
                    // codeReaderRef.current.timeBetweenDecodingAttempts = 500;
                    streamRef.current = stream;
                    const video = document.createElement("video", {});
                    let { width, height } = stream.getTracks()[0].getSettings();
                    video.width = width!;
                    video.height = height!;
                    video.srcObject = streamRef.current;
                    video.play().then(() => {
                        videoRef.current = video;
                        callDecodeWorker();
                        console.log(`videowidth ${videoRef.current.width}, height ${videoRef.current.height}`);
                    });
                }
            })
            .catch(reason => {
                console.log("catch: " + reason);
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

    const callDecodeWorker = useCallback(() => {
        console.log("callDecodeWorker");
        if (codeReaderRef.current && !stopped.current) {
            stopped.current = false;
            if (videoRef.current) {
                const myWorker = returnWorker();
                myWorker.onmessage = event => {
                    if (event.data !== null) {
                        console.log(`Data recieved ${event.data[0]}`);
                        handleResult(event.data[0], event.data[1]);
                    }
                    myWorker.terminate();
                    if (scanning.current && !stopped.current) {
                        callDecodeWorker();
                    } else {
                        console.log("Stopping loop");
                    }
                };
                const captureCanvas = createCaptureCanvas();
                captureCanvas?.getContext("2d")?.drawImage(videoRef.current, 0, 0);
                const imgData = captureCanvas
                    ?.getContext("2d")
                    ?.getImageData(0, 0, videoRef.current.width, videoRef.current.height);
                myWorker.postMessage([captureCanvas.width, captureCanvas.height, imgData]);
            }
        }
    }, []);

    const handleResult = (text: string, resultPoints: ResultPoint[]) => {
        setResultsMap(oldResults => {
            if (oldResults.find(old => old.id === text)) {
                const changedResult = oldResults.slice(0);
                let indexToChange: number | undefined;
                changedResult.forEach((element, index) => {
                    if (element.id === text) {
                        indexToChange = index;
                    }
                });
                if (indexToChange !== undefined) {
                    changedResult[indexToChange] = {
                        id: text,
                        result: resultPoints
                    };
                }
                return changedResult;
            } else {
                const newArray = [...oldResults, { id: text, result: resultPoints }];
                return newArray;
            }
        });
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
        if (engineContext.scene && !startLoopTrack) {
            engineContext.scene.onPointerObservable.add(pointerInfo => {
                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN:
                        scanning.current = !scanning.current;
                        console.log(`Scanning is ${scanning.current}`);
                        if (scanning.current) {
                            startStream();
                        } else {
                            console.log("Stopping stream");
                            streamRef.current?.getVideoTracks().forEach(track => {
                                track.stop();
                            });
                        }
                        break;
                }
            });
            return () => {
                stopped.current = true;
            };
        }
    }, [engineContext.scene, codeReaderRef.current]);

    useEffect(() => {
        resultsMap.forEach(result => {
            const foundIndex = cubes.findIndex(cube => cube.id === result.id);
            if (engineContext.scene) {
                var rays: Ray[] = [];
                result.result.forEach((point, index) => {
                    const ray = engineContext.scene!.pick(point.x, point.y);
                    if (ray?.ray) {
                        rays[index] = ray.ray;
                    }
                });
                if (rays.length !== 0) {
                    if (foundIndex !== -1 && cubes[foundIndex].mesh) {
                        rays.forEach((currentRay, index) => {
                            const closestPoint = ClosestPointOnTwoLines(
                                cubes[foundIndex].previousRays[index],
                                currentRay
                            );
                            if (closestPoint !== Vector3.Zero()) {
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
            setParentID(localImageTracker.uniqueId);
        }
    }, [engineContext]);

    return (
        <>
            {/* <canvas ref={canvasRef} width="1920" height="1080" /> */}
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
