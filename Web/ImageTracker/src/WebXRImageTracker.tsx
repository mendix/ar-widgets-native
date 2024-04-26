import React, { createElement, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
    PointerEventTypes,
    Ray,
    Scene,
    UniversalCamera,
    Vector3,
    WebXRCamera,
    MeshBuilder,
    Color4,
    Mesh
} from "@babylonjs/core";
import { WebXRImageTrackerContainerProps } from "../typings/WebXRImageTrackerProps";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { BrowserMultiFormatReader } from "@zxing/library/cjs";
import Big from "big.js";

export function WebXRImageTracker(props: WebXRImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const [newResult, setNewResult] = useState<{ id: string; position: Vector3 }>();
    const stopped = useRef<Boolean>(false);
    const scanning = useRef<Boolean>(false);
    const codeReaderRef = useRef<BrowserMultiFormatReader>();
    const streamRef = useRef<MediaStream>();
    const videoRef = useRef<HTMLVideoElement>();
    const engineContextCamera = useRef<WebXRCamera>();
    const savedPosition = useRef<Vector3>();
    const sceneRef = useRef<Scene>();

    const returnWorker = useCallback(() => {
        return new Worker("widgets/com/mendix/shared/Worker.js");
    }, []);
    const createCaptureCanvas = useCallback(() => {
        return codeReaderRef.current!.createCaptureCanvas(videoRef.current);
    }, []);
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
    const callDecodeWorker = () => {
        if (
            codeReaderRef.current &&
            !stopped.current &&
            videoRef.current &&
            sceneRef.current &&
            (engineContextCamera.current !== undefined || sceneRef.current?.activeCamera !== (undefined || null))
        ) {
            //

            const myWorker = returnWorker();
            myWorker.onmessage = event => {
                if (event.data[0] !== undefined) {
                    setNewResult({
                        id: event.data[0],
                        position: savedPosition.current!
                    });
                } else {
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

            const cameraToClone = engineContextCamera.current ?? sceneRef.current.activeCamera;
            savedPosition.current = cameraToClone?.getForwardRay().direction.scale(0.5);
            const imgData = captureCanvas
                ?.getContext("2d")
                ?.getImageData(0, 0, videoRef.current.width, videoRef.current.height);
            myWorker.postMessage([captureCanvas.width, captureCanvas.height, imgData]);
        } else {
            setTimeout(() => {
                if (!stopped.current && scanning.current) callDecodeWorker();
            }, 250);
        }
    };

    useEffect(() => {
        if (engineContext.camera) {
            engineContextCamera.current = engineContext.camera;
        }
    }, [engineContext.camera]);
    useEffect(() => {
        if (newResult) {
            props.mxScannedResult.setValue(newResult.id);
            props.mxPositionX.setValue(Big(newResult.position.x.toPrecision(4)));
            props.mxPositionY.setValue(Big(newResult.position.y.toPrecision(4)));
            props.mxPositionZ.setValue(Big(newResult.position.z.toPrecision(4)));
            props.mxOnDataChanged?.canExecute && !props.mxOnDataChanged.isExecuting
                ? props.mxOnDataChanged.execute()
                : null;
        }
    }, [newResult]);

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
}
