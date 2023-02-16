import React, { createElement, useEffect, useState } from "react";
import { WebARSquareContainerProps } from "../typings/WebARSquareProps";
import { MeshComponent, setAttributes } from "../../../Shared/ComponentParent/src/MeshComponent";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder, Scene, Texture } from "@babylonjs/core";
import { useGizmoComponent } from "../../../Shared/ComponentParent/src/GizmoComponent";

export function WebARSquare(props: WebARSquareContainerProps): React.ReactElement | void {
    const { mxMaterialTexture } = props;
    const [mesh, setMesh] = useState<Mesh>();
    const [scene, setScene] = useState<Scene>();
    const handleSceneLoaded = (scene: Scene) => {
        const planeMesh = MeshBuilder.CreatePlane(props.name, { size: 1 }, scene);
        const invisibleBox = MeshBuilder.CreateBox("invisibleBox" + props.name, { size: 1 }, scene);
        invisibleBox.visibility = 0;
        invisibleBox.scaling.z = 0.1;
        invisibleBox.setParent(planeMesh);
        setMesh(planeMesh);
        setScene(scene);
    };
    const [texture, setTexture] = useState<Texture>();
    const gizmoTransform = useGizmoComponent({
        mesh: mesh,
        draggingEnabled: props.mxDraggingEnabled.value ?? false,
        pinchEnabled: props.mxPinchEnabled.value ?? false,
        rotationEnabled: props.mxPinchRotationEnabled.value ?? false,
        gizmoSize: Number(props.mxGizmoSize.value) ?? 0.1,
        color: props.mxGizmoColor.value ?? "#ffffff"
    });

    useEffect(() => {
        if (mxMaterialTexture && scene) {
            if (typeof mxMaterialTexture.value === "string") {
                //@ts-ignore - for some reason it thinks mxMaterialTexture is of type never, code does work though
                setTexture(new Texture(mxMaterialTexture.value, scene));
            } else if (typeof mxMaterialTexture.value === "object") {
                setTexture(new Texture(mxMaterialTexture.value.uri, scene));
            }
        }
    }, [mxMaterialTexture, scene]);

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
        <MeshComponent
            rootMesh={mesh}
            allMeshes={mesh ? [mesh] : undefined}
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
            mxMaterialColor={props.mxMaterialColor.value ?? "#0CABF9"}
            mxMaterialOption={props.mxMaterialOption}
            texture={texture}
            mxMetalness={props.mxMetalness}
            mxOpacity={props.mxOpacity}
            mxRoughness={props.mxRoughness}
            mxLightingType={props.mxLightingType}
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
    );
}
