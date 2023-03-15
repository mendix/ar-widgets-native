import React, { createElement, Context, useState, useEffect } from "react";
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

    const handleSceneLoaded = (scene: Scene) => {
        const localImageTracker = new Mesh(props.name, scene);
        switch (props.mxBillboard) {
            case "billboard":
                localImageTracker.billboardMode = Mesh.BILLBOARDMODE_ALL;
                break;
            case "billboardX":
                localImageTracker.billboardMode = Mesh.BILLBOARDMODE_X;
                break;
            case "billboardY":
                localImageTracker.billboardMode = Mesh.BILLBOARDMODE_Y;
                break;
            default:
                break;
        }

        setImageTrackerParent(localImageTracker);
        setParentID(localImageTracker.uniqueId);
    };

    return (
        <>
            <MeshComponent
                rootMesh={imagetrackerParent}
                allMeshes={imagetrackerParent ? [imagetrackerParent] : undefined}
                mxPositionType={props.mxPositionType}
                mxPositionXStat={props.mxPositionXStat}
                mxPositionYStat={props.mxPositionYStat}
                mxPositionZStat={props.mxPositionZStat}
                mxPositionYAtt={props.mxPositionYAtt}
                mxPositionXAtt={props.mxPositionXAtt}
                mxPositionZAtt={props.mxPositionZAtt}
                mxPositionXExpr={props.mxPositionXExpr}
                mxPositionYExpr={props.mxPositionYExpr}
                mxPositionZExpr={props.mxPositionZExpr}
                mxRotationType={props.mxRotationType}
                mxRotationXStat={props.mxRotationXStat}
                mxRotationYStat={props.mxRotationYStat}
                mxRotationZStat={props.mxRotationZStat}
                mxRotationXAtt={props.mxRotationXAtt}
                mxRotationYAtt={props.mxRotationYAtt}
                mxRotationZAtt={props.mxRotationZAtt}
                mxRotationXExpr={props.mxRotationXExpr}
                mxRotationYExpr={props.mxRotationYExpr}
                mxRotationZExpr={props.mxRotationZExpr}
                mxScaleType={props.mxScaleType}
                mxScaleXStat={props.mxScaleXStat}
                mxScaleYStat={props.mxScaleYStat}
                mxScaleZStat={props.mxScaleZStat}
                mxScaleXAtt={props.mxScaleXAtt}
                mxScaleYAtt={props.mxScaleYAtt}
                mxScaleZAtt={props.mxScaleZAtt}
                mxScaleXExpr={props.mxScaleXExpr}
                mxScaleYExpr={props.mxScaleYExpr}
                mxScaleZExpr={props.mxScaleZExpr}
                OnSceneLoaded={handleSceneLoaded}
                mxUseDraggingInteraction={props.mxUseDraggingInteraction}
                mxUsePinchInteraction={props.mxUsePinchInteraction}
                mxDraggingEnabled={props.mxDraggingEnabled.value ?? false}
                mxDragType={props.mxDragType}
                mxOnDrag={props.mxOnDrag}
                mxPinchEnabled={props.mxPinchEnabled.value ?? false}
                mxPinchToScaleEnabled={false}
                mxOnPinchActionValue={props.mxOnPinchActionValue}
                mxOnHoverEnter={props.mxOnHoverEnter}
                mxOnHoverExit={props.mxOnHoverExit}
                mxOnClick={props.mxOnClick}
            />
            <EngineContext.Provider value={engineContext!} />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
