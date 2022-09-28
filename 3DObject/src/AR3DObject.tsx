import React, { createElement, useEffect, useState } from "react";
import { Style } from "@mendix/pluggable-widgets-tools";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshComponent } from "../../ComponentParent/src/MeshComponent";
import { AR3DObjectProps } from "../typings/AR3DObjectProps";
import { ValueStatus } from "mendix";
import { Scene } from "@babylonjs/core/scene";

export const AR3DObject = (props: AR3DObjectProps<Style>) => {
    const [mesh, setMesh] = useState<Mesh | undefined>();
    const [scene, setScene] = useState<Scene>();

    const handleSceneLoaded = (loadedScene: Scene) => {
        setScene(loadedScene);
        if (props.mxSourceExpr.status === ValueStatus.Available) {
            SceneLoader.LoadAssetContainer(props.mxSourceExpr.value, undefined, loadedScene, container => {
                // Empty mesh, doesn't render anything but can influence child objects. This allows us to move multiple loaded meshes as if it's just one.
                const parent = new Mesh("AR3DObjectParent", loadedScene);
                container.meshes?.forEach(mesh => {
                    // Set the parent of each mesh in this container to our new parent mesh
                    mesh.parent = parent;
                });
                setMesh(parent);
                // Adds the objects to our current scene
                container.addAllToScene();
            });
        }
    };

    useEffect(() => {
        if (mesh && props.mxSourceExpr.value) {
            mesh.dispose();
            SceneLoader.LoadAssetContainer(props.mxSourceExpr.value, undefined, scene, container => {
                // Empty mesh, doesn't render anything but can influence child objects. This allows us to move multiple loaded meshes as if it's just one.
                const parent = new Mesh("AR3DObjectParent", scene);
                container.meshes?.forEach(mesh => {
                    // Set the parent of each mesh in this container to our new parent mesh
                    mesh.parent = parent;
                });
                setMesh(parent);
                // Adds the objects to our current scene
                container.addAllToScene();
            });
        }
    }, [props.mxSourceExpr.value]);

    return (
        <MeshComponent
            mesh={mesh}
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
            mxMaterialTexture={props.mxMaterialTexture}
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
            mxPinchToScaleEnabled={props.mxPinchToScaleEnabled}
            mxOnPinchActionValue={props.mxOnPinchActionValue}
            mxOnHoverEnter={props.mxOnHoverEnter}
            mxOnHoverExit={props.mxOnHoverExit}
            mxOnClick={props.mxOnClick}
        />
    );
};
