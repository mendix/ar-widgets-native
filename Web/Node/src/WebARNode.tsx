import React, { createElement, Context, useState } from "react";
import { Mesh, Scene } from "@babylonjs/core";
import { WebARNodeContainerProps } from "../typings/WebARNodeProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { GizmoComponent } from "../../../Shared/ComponentParent/src/GizmoComponent";
import { GlobalContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import Big from "big.js";

export function WebARNode(props: WebARNodeContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const [nodeParent, setNodeParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);

    const handleSceneLoaded = (scene: Scene) => {
        const localNode = new Mesh(props.name, scene);
        switch (props.mxBillboard) {
            case "billboard":
                localNode.billboardMode = Mesh.BILLBOARDMODE_ALL;
                break;
            case "billboardX":
                localNode.billboardMode = Mesh.BILLBOARDMODE_X;
                break;
            case "billboardY":
                localNode.billboardMode = Mesh.BILLBOARDMODE_Y;
                break;
            default:
                break;
        }

        setNodeParent(localNode);
        setParentID(localNode.uniqueId);
    };

    return (
        <>
            <GizmoComponent
                color={props.mxGizmoColor?.value ?? "#ffffff"}
                mesh={nodeParent}
                gizmoSize={Number(props.mxGizmoSize.value) ?? 0.05}
                draggingEnabled={props.mxDraggingEnabled.value ?? false}
                pinchEnabled={props.mxPinchEnabled.value ?? false}
                rotationEnabled={props.mxPinchRotationEnabled.value ?? false}
                onScale={newScale => {
                    console.log(props.mxScaleType);
                    if (props.mxScaleType === "Attribute") {
                        props.mxScaleXAtt?.setValue(Big(newScale.x.toPrecision(4)));
                        props.mxScaleYAtt?.setValue(Big(newScale.y.toPrecision(4)));
                        props.mxScaleZAtt?.setValue(Big(newScale.z.toPrecision(4)));
                    }
                }}
                onDrag={newPosition => {
                    if (props.mxPositionType === "Attribute") {
                        props.mxPositionXAtt?.setValue(Big(newPosition.x.toPrecision(4)));
                        props.mxPositionYAtt?.setValue(Big(newPosition.y.toPrecision(4)));
                        props.mxPositionZAtt?.setValue(Big(newPosition.z.toPrecision(4)));
                    }
                }}
                onRotate={newRotation => {
                    if (props.mxRotationType === "Attribute") {
                        props.mxRotationXAtt?.setValue(Big(newRotation.x.toPrecision(4)));
                        props.mxRotationYAtt?.setValue(Big(newRotation.y.toPrecision(4)));
                        props.mxRotationZAtt?.setValue(Big(newRotation.z.toPrecision(4)));
                    }
                }}
            />
            <MeshComponent
                rootMesh={nodeParent}
                allMeshes={nodeParent ? [nodeParent] : undefined}
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
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
