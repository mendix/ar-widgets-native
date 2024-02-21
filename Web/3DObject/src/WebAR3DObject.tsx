import React, { createElement, useEffect, useState } from "react";
import { WebAR3DObjectContainerProps } from "../typings/WebAR3DObjectProps";
import { MeshComponent, setAttributes } from "../../../Shared/ComponentParent/src/MeshComponent";
import { Mesh, Scene, SceneLoader, Texture } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { useGizmoComponent } from "../../../Shared/ComponentParent/src/useGizmoComponent";

export function WebAR3DObject(props: WebAR3DObjectContainerProps): React.ReactElement | void {
    const { mxMaterialTexture, mxMaterialAmbientOcclusion } = props;
    const [rootMesh, setRootMesh] = useState<Mesh | undefined>();
    const [allMeshes, setAllMeshes] = useState<Mesh[] | undefined>();
    const [scene, setScene] = useState<Scene>();
    const [texture, setTexture] = useState<Texture>();
    const [AOTexture, setAOTexture] = useState<Texture>();
    const [rootMeshURLLoaded, setRootMeshURLLoaded] = useState<string>();
    const gizmoTransform = useGizmoComponent({
        mesh: rootMesh,
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
        if (mxMaterialAmbientOcclusion && scene) {
            if (typeof mxMaterialAmbientOcclusion.value === "string") {
                //@ts-ignore - for some reason it thinks mxMaterialAmbientOcclusion is of type never, code does work though
                let tex = new Texture(mxMaterialAmbientOcclusion.value, scene);
                setAOTexture(tex);
            } else if (typeof mxMaterialAmbientOcclusion.value === "object") {
                let tex = new Texture(mxMaterialAmbientOcclusion.value.uri, scene);
                setAOTexture(tex);
            }
        }
    }, [mxMaterialAmbientOcclusion, scene]);

    const handleSceneLoaded = (loadedScene: Scene) => {
        setScene(loadedScene);
        handleMesh(loadedScene);
    };

    useEffect(() => {
        if (rootMeshURLLoaded !== props.mxSourceExpr.value) {
            if (rootMesh) rootMesh.dispose();
            if (scene) handleMesh(scene);
            setRootMeshURLLoaded(props.mxSourceExpr.value);
        }
    }, [props.mxSourceExpr.value]);

    const handleMesh = (scene: Scene) => {
        if (props.mxSourceExpr.value) {
            SceneLoader.ImportMesh("", props.mxSourceExpr.value, "", scene, models => {
                models[0].rotationQuaternion = null;

                setRootMesh(models[0] as Mesh);
                let castMeshes: Mesh[] = [];
                models.forEach(abstractMesh => {
                    abstractMesh.name = props.name;
                    castMeshes = [...castMeshes, abstractMesh as Mesh];
                });
                setAllMeshes(castMeshes);
            });
        }
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
                aOTexture={AOTexture}
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
