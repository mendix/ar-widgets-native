import { createElement, ReactElement, useEffect, useRef, useState } from "react";
import { EngineContext, ParentContext } from "../../../Shared/ComponentParent/src/EngineContext";
import { ValueStatus } from "mendix";
import {
    ArcRotateCamera,
    Color3,
    Color4,
    CubeTexture,
    Engine,
    HemisphericLight,
    Mesh,
    Scene,
    SceneLoader,
    Tools,
    Vector3,
    WebXRExperienceHelper,
    WebXRSessionManager
} from "@babylonjs/core";
import { WebARContainerContainerProps } from "../typings/WebARContainerProps";
export function WebARContainer(props: WebARContainerContainerProps): ReactElement {
    const [scene, setScene] = useState<Scene>();
    const [parent, setParent] = useState<Mesh | undefined>();
    const [parentID, setParentID] = useState<number>(NaN);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // If we want realistic lighting, use the provided environment map
        if (scene && props.mxUsePBR && props.mxHdrPath?.status === ValueStatus.Available) {
            const hdrTexture = CubeTexture.CreateFromPrefilteredData(props.mxHdrPath.value, scene);
            scene.environmentTexture = hdrTexture;
        }
    }, [scene, props.mxHdrPath]);

    useEffect(() => {
        if (scene === undefined) {
            const engine = new Engine(canvasRef.current, true, { xrCompatible: true }, true);
            function updateSize() {
                console.log("Resize");
                engine.resize();
            }

            window.addEventListener("resize", updateSize);
            const newScene = new Scene(engine);

            newScene.clearColor = new Color4(0.5, 0.5, 0.5, 1);
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

            // This attaches the camera to the canvas
            camera.attachControl(canvasRef.current, true);

            // Add a parent so scene can be rotated in preview mode.
            const newParent = new Mesh("ContainerARParent", newScene);

            setParent(newParent);
            setParentID(newParent.uniqueId);
            engine.runRenderLoop(function () {
                newScene.render();
            });

            if (parent) {
                parent.rotation = Vector3.Zero();
            }

            const instantiateWebXR = async () => {
                const supported = await WebXRSessionManager.IsSessionSupportedAsync("immersive-vr");
                console.log("is immersive-vr supported? " + supported);
                var defaultXRExperience = await newScene.createDefaultXRExperienceAsync({
                    uiOptions: {
                        sessionMode: "immersive-vr"
                    }
                });
                if (!defaultXRExperience.baseExperience) {
                    console.log("No XR support");
                } else {
                    // defaultXRExperience.baseExperience.enterXRAsync("immersive-ar", "unbounded")
                    console.log("XR supported, state: " + defaultXRExperience.baseExperience.state);
                }
            };
            instantiateWebXR();
            return () => {
                window.removeEventListener("resize", updateSize);
            };
        }
    }, [canvasRef.current]);

    return (
        <EngineContext.Provider
            value={{
                scene
            }}
        >
            <div id="reader" />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        </EngineContext.Provider>
    );
}
