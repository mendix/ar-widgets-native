import React, { createElement, useEffect, useRef, useState } from "react";
import { WebARSquareContainerProps } from "../typings/WebARSquareProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder, Scene, Texture } from "@babylonjs/core";
import { GizmoComponent } from "../../../Shared/ComponentParent/src/GizmoComponent";
import Big from "big.js";

export function WebARSquare(props: WebARSquareContainerProps): React.ReactElement | void {
    const { mxMaterialTexture } = props;
    const [mesh, setMesh] = useState<Mesh>();
    const meshRef = useRef<Mesh>();
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
        console.log(props.mxScaleXAtt);
    }, [props.mxScaleXAtt]);

    return (
        <>
            <GizmoComponent
                color={props.mxGizmoColor?.value ?? "#ffffff"}
                mesh={mesh}
                gizmoSize={Number(props.mxGizmoSize.value) ?? 0.05}
                draggingEnabled={props.mxDraggingEnabled.value ?? false}
                pinchEnabled={props.mxPinchEnabled.value ?? false}
                rotationEnabled={props.mxPinchRotationEnabled.value ?? false}
                onScale={newScale => {
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
        </>
    );
}
