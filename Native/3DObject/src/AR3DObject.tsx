import React, { createElement, useEffect, useState } from "react";
import { Style } from "@mendix/pluggable-widgets-tools";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { AR3DObjectProps } from "../typings/AR3DObjectProps";
import { Scene } from "@babylonjs/core/scene";
import { retrieveImageFromNumber } from "../../../Shared/ComponentParent/src/retrieveImageFromNumber";
import { Texture } from "@babylonjs/core";

export const AR3DObject = (props: AR3DObjectProps<Style>) => {
    const { mxMaterialTexture } = props;
    const [rootMesh, setRootMesh] = useState<Mesh | undefined>();
    const [allMeshes, setAllMeshes] = useState<Mesh[] | undefined>();
    const [scene, setScene] = useState<Scene>();
    const [texture, setTexture] = useState<Texture>();

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

    const handleSceneLoaded = (loadedScene: Scene) => {
        setScene(loadedScene);
        handleMesh(loadedScene);
    };

    useEffect(() => {
        if (rootMesh) {
            rootMesh.dispose();
        }
        if (scene) {
            handleMesh(scene);
        }
    }, [props.mxSourceExpr.value]);

    const handleMesh = (scene: Scene) => {
        if (props.mxSourceExpr.value) {
            SceneLoader.ImportMesh("", props.mxSourceExpr.value, "", scene, models => {
                setRootMesh(models[0] as Mesh);
                // Set root quaternion rotation to null, since we want to use our own.
                models[0].rotationQuaternion = null;
                let castMeshes: Mesh[] = [];
                models.forEach(abstractMesh => {
                    castMeshes = [...castMeshes, abstractMesh as Mesh];
                });
                setAllMeshes(castMeshes);
            });
        }
    };

    return (
        <MeshComponent
            rootMesh={rootMesh}
            allMeshes={allMeshes}
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
            mxPinchToScaleEnabled={props.mxPinchToScaleEnabled}
            mxOnPinchActionValue={props.mxOnPinchActionValue}
            mxOnHoverEnter={props.mxOnHoverEnter}
            mxOnHoverExit={props.mxOnHoverExit}
            mxOnClick={props.mxOnClick}
        />
    );
};
