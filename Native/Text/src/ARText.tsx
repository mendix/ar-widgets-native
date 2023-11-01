import React, { createElement, useEffect, useRef, useState } from "react";
import { ARTextProps } from "../typings/ARTextProps";
import { Style } from "mendix";
import { MeshComponent, setAttributes } from "../../../Shared/ComponentParent/src/MeshComponent";
import { useGizmoComponent } from "../../../Shared/ComponentParent/src/useGizmoComponent";
import { Mesh, MeshBuilder, Scene, Texture, Vector3 } from "@babylonjs/core";
import { retrieveImageFromNumber } from "../../../Shared/ComponentParent/src/retrieveImageFromNumber";
import font from "../../../Shared/ComponentParent/utils/Open Sans_Regular.json";
import "../../../Shared/ComponentParent/utils/injectEarcut";

export function ARText(props: ARTextProps<Style>): React.ReactElement {
    const { mxMaterialTexture, mxMaterialColor, mxDraggingEnabled, mxPinchEnabled, mxText, ...restProps } = props;
    const [mesh, setMesh] = useState<Mesh>();
    const [scene, setScene] = useState<Scene>();
    const [texture, setTexture] = useState<Texture>();
    const gizmoTransform = useGizmoComponent({
        mesh: mesh,
        draggingEnabled: props.mxDraggingEnabled.value ?? false,
        pinchEnabled: props.mxPinchEnabled.value ?? false,
        rotationEnabled: props.mxPinchRotationEnabled.value ?? false,
        gizmoSize: Number(props.mxGizmoSize.value) ?? 0.1,
        color: props.mxGizmoColor.value ?? "#ffffff"
    });

    const handleSceneLoaded = (scene: Scene) => {
        const newMesh = MeshBuilder.CreateText(
            "myText",
            mxText.value ?? "",
            font,
            {
                resolution: 64,
                depth: 10
            },
            scene
        );
        if (newMesh) {
            newMesh.scaling = Vector3.Zero();
            setMesh(newMesh);
        }
        setScene(scene);
    };

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
        if (mxMaterialTexture && scene) {
            if (typeof mxMaterialTexture.value === "string") {
                setTexture(new Texture(mxMaterialTexture.value, scene));
            } else if (typeof mxMaterialTexture.value === "number") {
                retrieveImageFromNumber(mxMaterialTexture.value)
                    .then(uri => {
                        setTexture(new Texture(uri, scene));
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (typeof mxMaterialTexture.value === "object") {
                setTexture(new Texture(`file://${mxMaterialTexture.value.uri}`));
            }
        }
    }, [mxMaterialTexture, scene]);

    useEffect(() => {
        if (props.mxText.value && font !== undefined && scene) {
            mesh?.dispose();
            const newMesh = MeshBuilder.CreateText(
                "myText",
                props.mxText.value ?? "",
                font,
                {
                    resolution: 64,
                    depth: 10
                },
                scene
            );
            if (newMesh) setMesh(newMesh);
        }
    }, [props.mxText, font]);

    return (
        <MeshComponent
            {...restProps}
            rootMesh={mesh}
            allMeshes={mesh ? [mesh] : undefined}
            OnSceneLoaded={handleSceneLoaded}
            mxMaterialColor={mxMaterialColor.value ?? "#0CABF9"}
            texture={texture}
            mxDraggingEnabled={mxDraggingEnabled.value ?? false}
            mxPinchEnabled={mxPinchEnabled.value ?? false}
            mxPinchToScaleEnabled={false}
        />
    );
}
