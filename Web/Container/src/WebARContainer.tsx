import { createElement, ReactElement, useEffect, useState } from "react";
import SceneComponent from "babylonjs-hook";
import { EngineContext, ParentContext } from "../../../Shared/ComponentParent/src/EngineContext";
import { ValueStatus } from "mendix";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import { Mesh } from "@babylonjs/core/Meshes";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Tools } from "@babylonjs/core/Misc/tools";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { WebARContainerContainerProps } from "../typings/WebARContainerProps";

export function WebARContainer(props: WebARContainerContainerProps): ReactElement {
    const [scene, setScene] = useState<Scene>();
    const [parent, setParent] = useState<Mesh | undefined>();
    const [parentID, setParentID] = useState<number>(NaN);

    useEffect(() => {
        // If we want realistic lighting, use the provided environment map
        if (scene && props.mxUsePBR && props.mxHdrPath?.status === ValueStatus.Available) {
            const hdrTexture = CubeTexture.CreateFromPrefilteredData(props.mxHdrPath.value, scene);
            scene.environmentTexture = hdrTexture;
        }
    }, [scene, props.mxHdrPath]);

    const onSceneReady = async (newScene: Scene) => {
        // This creates and positions a free camera (non-mesh)
        const camera = new ArcRotateCamera(
            "MainCamera",
            Tools.ToRadians(-90),
            Tools.ToRadians(70),
            Number(props.mxPreviewCameraDistance),
            new Vector3(0, 0, 0),
            newScene
        );
        camera.minZ = 0.1;
        // This targets the camera to scene origin
        new HemisphericLight("light", Vector3.Up(), newScene);
        setScene(newScene);
        const canvas = newScene.getEngine().getRenderingCanvas();

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // Add a parent so scene can be rotated in preview mode.
        const newParent = new Mesh("ContainerARParent", newScene);
        setParent(newParent);
        setParentID(newParent.uniqueId);

        await newScene
            .createDefaultXRExperienceAsync({
                uiOptions: { sessionMode: "immersive-ar" },
                disableTeleportation: true,
                optionalFeatures: true
            })
            .catch(reason => {
                console.log("Could not start AR. " + reason);
            });

        if (parent) {
            parent.rotation = Vector3.Zero();
        }
    };

    return (
        <EngineContext.Provider
            value={{
                scene
            }}
        >
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
            <SceneComponent
                antialias
                style={{ height: "100%", width: "100%" }}
                onSceneReady={onSceneReady}
                id="my-canvas"
            />
        </EngineContext.Provider>
    );
}
