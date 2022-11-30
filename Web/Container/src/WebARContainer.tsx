import { createElement, ReactElement, useEffect, useState } from "react";
import SceneComponent from "babylonjs-hook";
import { EngineContext, ParentContext } from "../../../Shared/ComponentParent/src/EngineContext";
import { ValueStatus } from "mendix";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { WebXRFeatureName, WebXRFeaturesManager } from "@babylonjs/core/XR/webXRFeaturesManager";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Tools } from "@babylonjs/core/Misc/tools";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { IWebXRTrackedImage, WebXRImageTracking } from "@babylonjs/core/XR/features/WebXRImageTracking";
import { WebARContainerContainerProps } from "../typings/WebARContainerProps";

export function WebARContainer(props: WebARContainerContainerProps): ReactElement {
    const [scene, setScene] = useState<Scene>();
    const [parent, setParent] = useState<Mesh | undefined>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [imageTrackingOptions, setImageTrackingOptions] = useState<
        Array<{
            src: string;
            estimatedRealWorldWidth: number;
        }>
    >([]);
    const [trackedImageLocation, setTrackedImageLocation] = useState<{ src: string; matrix: Matrix }>();
    const [featuresManager, setFeaturesManager] = useState<WebXRFeaturesManager>();
    const [xrActive, setXrActive] = useState<boolean>(false);

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

        const xr = await newScene
            .createDefaultXRExperienceAsync({
                disableDefaultUI: true,
                disableTeleportation: true,
                optionalFeatures: true
            })
            .catch(reason => {
                console.log("Could not start AR. " + reason);
            });
        if (xr) {
            await xr.baseExperience.enterXRAsync("immersive-ar", "unbounded", xr.renderTarget);
            // If any exist, add the images that need to be tracked. This has to happen here, because they need to be added before starting the XR session
            if (imageTrackingOptions !== undefined) {
                const convertedImageOptions = {
                    images: imageTrackingOptions
                };
                const webXRImageTrackingModule = xr.baseExperience.featuresManager.enableFeature(
                    WebXRFeatureName.IMAGE_TRACKING,
                    "latest",
                    convertedImageOptions
                ) as WebXRImageTracking;
                webXRImageTrackingModule.onUntrackableImageFoundObservable.add(event => {
                    console.error(
                        "Image provided is untrackable: " + webXRImageTrackingModule.options.images[event].src
                    );
                });

                webXRImageTrackingModule.onTrackedImageUpdatedObservable.add((imageObject: IWebXRTrackedImage) => {
                    if (!imageObject.emulated) {
                        setTrackedImageLocation({
                            src: convertedImageOptions.images[imageObject.id].src,
                            matrix: imageObject.transformationMatrix
                        });
                    }
                });
            }
            setFeaturesManager(xr.baseExperience.featuresManager);
            newScene.activeCamera = xr.baseExperience.camera;
            setXrActive(true);
        }
        if (parent) {
            parent.rotation = Vector3.Zero();
        }
    };

    return (
        <EngineContext.Provider
            value={{
                scene,
                featuresManager,
                xrActive,
                setImageTrackingOptions,
                trackedImageLocation
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
