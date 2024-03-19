import { useEffect, useRef, useState } from "react";
import { ARTextProps } from "../typings/ARTextProps";
import { setAttributes, MeshComponent } from "./MeshComponent";
import { useGizmoComponent } from "./useGizmoComponent";
import font from "../utils/Open Sans_Regular.json";
import "../utils/injectEarcut";
import { Mesh, Scene, MeshBuilder, Vector3, Texture } from "@babylonjs/core";

export function SharedARText(props: ARTextProps): React.ReactElement {
    const {
        mxMaterialTexture,
        mxText,
        mxDraggingEnabled,
        mxPinchEnabled,
        mxPinchRotationEnabled,
        mxGizmoSize,
        mxGizmoColor,
        mxMaterialColor,
        compiledTexture,
        useGizmo,
        ...restOfProps
    } = props;
    const global = globalThis;
    const [mesh, setMesh] = useState<Mesh>();
    const [scene, setScene] = useState<Scene>();
    const currentText = useRef<string>();
    const gizmoTransform = useGizmo
        ? useGizmoComponent({
              mesh: mesh,
              draggingEnabled: mxDraggingEnabled.value ?? false,
              pinchEnabled: mxPinchEnabled.value ?? false,
              rotationEnabled: mxPinchRotationEnabled?.value ?? false,
              gizmoSize: Number(mxGizmoSize?.value) ?? 0.1,
              color: mxGizmoColor?.value ?? "#ffffff"
          })
        : null;
    const textParent = useRef<Mesh>();
    const handleSceneLoaded = (newScene: Scene) => {
        textParent.current = new Mesh("TextParent");
        createTextMesh(newScene);
        setScene(newScene);
        props.handleSceneLoaded ? props.handleSceneLoaded(newScene) : null;
    };
    const createTextMesh = (scene: Scene) => {
        const newMesh = MeshBuilder.CreateText(
            "myText",
            mxText.value ?? "",
            font,
            {
                size: 1,
                resolution: 64,
                depth: 1
            },
            scene
        );
        if (newMesh) setMesh(newMesh);
    };

    useEffect(() => {
        if (useGizmo) {
            if (gizmoTransform?.newPosition) {
                setAttributes(
                    gizmoTransform?.newPosition,
                    props.mxPositionXAtt,
                    props.mxPositionYAtt,
                    props.mxPositionZAtt
                );
            }
            if (gizmoTransform?.newRotation) {
                setAttributes(
                    gizmoTransform?.newRotation,
                    props.mxRotationXAtt,
                    props.mxRotationYAtt,
                    props.mxRotationZAtt
                );
            }
            if (gizmoTransform?.newScale) {
                setAttributes(gizmoTransform?.newScale, props.mxScaleXAtt, props.mxScaleYAtt, props.mxScaleZAtt);
            }
        }
    }, [useGizmo, gizmoTransform?.newPosition, gizmoTransform?.newRotation, gizmoTransform?.newScale]);

    useEffect(() => {
        if (currentText.current !== mxText.value && font !== undefined && scene) {
            if (mesh) mesh.dispose();
            currentText.current = mxText.value;
            createTextMesh(scene);
        }
    }, [mxText.value, font]);

    return (
        <MeshComponent
            {...restOfProps}
            rootMesh={mesh}
            allMeshes={mesh ? [mesh] : undefined}
            OnSceneLoaded={handleSceneLoaded}
            mxMaterialColor={mxMaterialColor.value ?? "#0CABF9"}
            texture={compiledTexture}
            mxDraggingEnabled={mxDraggingEnabled.value ?? false}
            mxPinchEnabled={mxPinchEnabled.value ?? false}
        />
    );
}
