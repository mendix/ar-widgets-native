import React, { createElement, useEffect, useState } from "react";
import { WebARTextContainerProps } from "../typings/WebARTextProps";
import { MeshComponent, setAttributes } from "../../../Shared/ComponentParent/src/MeshComponent";
import { useGizmoComponent } from "../../../Shared/ComponentParent/src/useGizmoComponent";
import { Mesh, MeshBuilder, Scene, Texture, Vector3 } from "@babylonjs/core";
import font from "../../../Shared/ComponentParent/utils/Open Sans_Regular.json";
import earcut from "earcut";

export function WebARText(props: WebARTextContainerProps): React.ReactElement {
    (window as any).earcut = earcut;
    const { mxMaterialTexture, mxText, name, tabIndex, style, ...restOfProps } = props;
    const [mesh, setMesh] = useState<Mesh>();
    const [scene, setScene] = useState<Scene>();
    const gizmoTransform = useGizmoComponent({
        mesh: mesh,
        draggingEnabled: props.mxDraggingEnabled.value ?? false,
        pinchEnabled: props.mxPinchEnabled.value ?? false,
        rotationEnabled: props.mxPinchRotationEnabled.value ?? false,
        gizmoSize: Number(props.mxGizmoSize.value) ?? 0.1,
        color: props.mxGizmoColor.value ?? "#ffffff"
    });

    const handleSceneLoaded = (scene: Scene) => {
        const newMesh = MeshBuilder.CreateText("myText", mxText.value ?? "", font, {
            resolution: 64,
            depth: 10
        });
        if (newMesh) {
            newMesh.scaling = Vector3.Zero();
            setMesh(newMesh);
        }
        setScene(scene);
    };
    const [texture, setTexture] = useState<Texture>();

    useEffect(() => {
        if (gizmoTransform.newPosition) {
            setAttributes(gizmoTransform.newPosition, props.mxPositionXAtt, props.mxPositionYAtt, props.mxPositionZAtt);
        }
        if (gizmoTransform.newRotation) {
            setAttributes(gizmoTransform.newRotation, props.mxRotationXAtt, props.mxRotationYAtt, props.mxRotationZAtt);
        }
        if (gizmoTransform.newScale) {
            setAttributes(gizmoTransform.newScale, props.mxScaleXAtt, props.mxScaleYAtt, props.mxScaleZAtt);
        }
    }, [gizmoTransform.newPosition, gizmoTransform.newRotation, gizmoTransform.newScale]);

    useEffect(() => {
        if (mxMaterialTexture !== undefined && scene) {
            if (typeof mxMaterialTexture.value === "string") {
                // @ts-ignore - for some reason it thinks mxMaterialTexture is of type never, code does work though
                setTexture(new Texture(mxMaterialTexture.value, scene));
            } else if (typeof mxMaterialTexture.value === "object") {
                setTexture(new Texture(mxMaterialTexture.value.uri, scene));
            }
        }
    }, [mxMaterialTexture, scene]);

    useEffect(() => {
        if (mxText.value && font !== undefined) {
            mesh?.dispose();
            const newMesh = MeshBuilder.CreateText("myText", mxText.value ?? "", font, {
                resolution: 64,
                depth: 10
            });
            if (newMesh) setMesh(newMesh);
        }
    }, [mxText, font]);

    return (
        <MeshComponent
            {...restOfProps}
            rootMesh={mesh}
            allMeshes={mesh ? [mesh] : undefined}
            OnSceneLoaded={handleSceneLoaded}
            mxMaterialColor={props.mxMaterialColor.value ?? "#0CABF9"}
            texture={texture}
            mxDraggingEnabled={props.mxDraggingEnabled.value ?? false}
            mxPinchEnabled={props.mxPinchEnabled.value ?? false}
            mxPinchToScaleEnabled={false}
        />
    );
}
