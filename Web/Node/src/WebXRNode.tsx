import React, { createElement, Context, useState, useEffect } from "react";
import { Mesh, Scene } from "@babylonjs/core";
import { WebXRNodeContainerProps } from "../typings/WebXRNodeProps";
import { MeshComponent, setAttributes } from "../../../Shared/ComponentParent/src/MeshComponent";
import { useGizmoComponent } from "../../../Shared/ComponentParent/src/useGizmoComponent";
import { GlobalContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";

export function WebXRNode(props: WebXRNodeContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const [nodeParent, setNodeParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const gizmoTransform = useGizmoComponent({
        mesh: nodeParent,
        draggingEnabled: props.mxDraggingEnabled.value ?? false,
        pinchEnabled: props.mxScalingEnabled.value ?? false,
        rotationEnabled: props.mxRotationEnabled.value ?? false,
        gizmoSize: Number(props.mxGizmoSize.value) ?? 0.1,
        color: props.mxGizmoColor.value ?? "#ffffff"
    });

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

    useEffect(() => {
        if (gizmoTransform.newPosition) {
            setAttributes(gizmoTransform.newPosition, props.mxPositionXAtt, props.mxPositionYAtt, props.mxPositionZAtt);
        }
    }, [gizmoTransform.newPosition]);

    useEffect(() => {
        if (gizmoTransform.newRotation) {
            setAttributes(gizmoTransform.newRotation, props.mxRotationXAtt, props.mxRotationYAtt, props.mxRotationZAtt);
        }
    }, [gizmoTransform.newRotation]);

    useEffect(() => {
        if (gizmoTransform.newScale) {
            setAttributes(gizmoTransform.newScale, props.mxScaleXAtt, props.mxScaleYAtt, props.mxScaleZAtt);
        }
    }, [gizmoTransform.newScale]);

    return (
        <>
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
                mxDraggingEnabled={props.mxDraggingEnabled.value ?? false}
                mxDragType={props.mxDragType}
                mxOnDrag={props.mxOnDrag}
                mxPinchEnabled={props.mxScalingEnabled.value ?? false}
                mxPinchToScaleEnabled={false}
                mxOnHoverEnter={props.mxOnHoverEnter}
                mxOnHoverExit={props.mxOnHoverExit}
                mxOnClick={props.mxOnClick}
            />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
