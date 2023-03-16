import React, { createElement, Context, useState, useEffect, useRef } from "react";
import { DynamicTexture, Mesh, Scene } from "@babylonjs/core";
import { WebARImageTrackerContainerProps } from "../typings/WebARImageTrackerProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { GlobalContext, EngineContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { Html5Qrcode } from "html5-qrcode";

export function WebARImageTracker(props: WebARImageTrackerContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const EngineContext: Context<EngineContext> = (global as GlobalContext).EngineContext;
    const [imagetrackerParent, setImageTrackerParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [engineContext, setEngineContext] = useState<EngineContext>();
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Html5Qrcode.getCameras()
            .then(devices => {
                /**
                 * devices would be an array of objects of type:
                 * { id: "id", label: "label" }
                 */
                if (devices && devices.length) {
                    const html5QrCode = new Html5Qrcode(/* element id */ "reader", true);
                    html5QrCode
                        .start(
                            { facingMode: "environment" },
                            {
                                fps: 1 // Optional, frame per seconds for qr code scanning
                                //qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
                            },
                            (decodedText, decodedResult) => {
                                console.log(decodedText, decodedResult);
                                if (imagetrackerParent && engineContext?.scene?.activeCamera) {
                                    imagetrackerParent.position = engineContext?.scene?.activeCamera?.position;
                                }
                                html5QrCode.stop();
                                // do something when code is read
                            },
                            () => {
                                //console.error(errorMessage);
                                // parse error, ignore it.
                            }
                        )
                        .catch(err => {
                            console.error("in catch: " + err);
                            // Start failed, handle it.
                        });
                    // .. use this to start scanning.
                }
            })
            .catch(err => {
                console.error(err);
                // handle err
            });
    }, []);

    useEffect(() => {
        if (engineContext?.scene) {
            const localImageTracker = new Mesh(props.name, engineContext?.scene);
            setImageTrackerParent(localImageTracker);
            setParentID(localImageTracker.uniqueId);
        }
    }, [engineContext]);

    useEffect(() => {
        console.log(videoRef.current);
    }, [videoRef]);

    return (
        <>
            <div ref={videoRef} id="reader" />
            <EngineContext.Provider value={engineContext!} />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
