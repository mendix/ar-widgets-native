import React, { createElement, useEffect, useState } from "react";
import { WebARCubeContainerProps } from "../typings/WebARCubeProps";
import { MeshComponent, setAttributes } from "../../../Shared/ComponentParent/src/MeshComponent";
import { GizmoComponent } from "../../../Shared/ComponentParent/src/GizmoComponent";
import { Mesh, MeshBuilder, Scene, Texture, Vector3 } from "@babylonjs/core";

export function WebARCube(props: WebARCubeContainerProps): React.ReactElement {
    const { mxMaterialTexture } = props;
    const [mesh, setMesh] = useState<Mesh>();
    const [scene, setScene] = useState<Scene>();
    const [rotationSet, setRotationSet] = useState<boolean>(false);
    const [position, setPosition] = useState<Vector3>();
    const [rotation, setRotation] = useState<Vector3>();
    const [scale, setScale] = useState<Vector3>();

    const handleSceneLoaded = (scene: Scene) => {
        setMesh(MeshBuilder.CreateBox(props.name, { size: 1 }, scene));
        setScene(scene);
    };
    const [texture, setTexture] = useState<Texture>();

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
        if (position) {
            setAttributes(position, props.mxPositionXAtt, props.mxPositionYAtt, props.mxPositionZAtt);
        }
    }, [position]);

    useEffect(() => {
        if (rotation) {
            setAttributes(rotation, props.mxRotationXAtt, props.mxRotationYAtt, props.mxRotationZAtt);
        }
    }, [rotation]);

    useEffect(() => {
        if (scale) {
            setAttributes(scale, props.mxScaleXAtt, props.mxScaleYAtt, props.mxScaleZAtt);
        }
    }, [scale]);

    return (
        <>
            <GizmoComponent
                color={props.mxGizmoColor?.value ?? "#ffffff"}
                mesh={rotationSet ? mesh : undefined}
                gizmoSize={Number(props.mxGizmoSize.value) ?? 0.05}
                draggingEnabled={props.mxDraggingEnabled.value ?? false}
                pinchEnabled={props.mxPinchEnabled.value ?? false}
                rotationEnabled={props.mxPinchRotationEnabled.value ?? false}
                onScale={newScale => {
                    setScale(newScale);
                }}
                onDrag={newPosition => {
                    setPosition(newPosition);
                }}
                onRotate={newRotation => {
                    setRotation(newRotation);
                }}
            />
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
                OnRotationSet={() => setRotationSet(true)}
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
        </>
    );
}
