import { createElement, ReactElement, useEffect, useRef, useState } from "react";
import { EngineContext, ParentContext } from "../../../Shared/ComponentParent/src/EngineContext";
import { ValueStatus } from "mendix";
import {
    Scene,
    Mesh,
    Engine,
    Camera,
    Light,
    CubeTexture,
    CompatibilityOptions,
    Color4,
    Tools,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    WebXRSessionManager,
    WebXRState
} from "@babylonjs/core";
import { WebXRContainerContainerProps } from "../typings/WebXRContainerProps";

export function WebXRContainer(props: WebXRContainerContainerProps): ReactElement {
    const [scene, setScene] = useState<Scene>();
    const [parent, setParent] = useState<Mesh | undefined>();
    const [parentID, setParentID] = useState<number>(NaN);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine>();
    const [camera, setCamera] = useState<Camera>();
    const xrActiveRef = useRef<boolean>(false);
    const skyboxRef = useRef<Mesh>();
    const light = useRef<Light>();

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const resizeObserver = new ResizeObserver(objectArray => {
            if (!xrActiveRef.current) {
                window.requestAnimationFrame((): void | undefined => {
                    if (!Array.isArray(objectArray) || !objectArray.length) {
                        return;
                    }
                    engineRef.current?.resize();
                });
            }
        });
        resizeObserver.observe(canvasRef.current as unknown as Element);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        // If we want realistic lighting, use the provided environment map
        if (scene && props.mxUsePBR && props.mxHdrPath?.status === ValueStatus.Available && scene.activeCamera) {
            const hdrTexture = CubeTexture.CreateFromPrefilteredData(props.mxHdrPath.value, scene);

            scene.environmentTexture = hdrTexture;
            skyboxRef.current = scene.createDefaultSkybox(
                hdrTexture,
                true,
                (scene.activeCamera?.maxZ - scene.activeCamera.minZ) / 2,
                0.3,
                false
            ) as Mesh;
            light.current?.setEnabled(false);
        }
    }, [scene, props.mxUsePBR, props.mxHdrPath, scene?.activeCamera]);

    useEffect(() => {
        if (scene === undefined) {
            const engine = new Engine(canvasRef.current, true, { xrCompatible: true }, true);
            engineRef.current = engine;
            CompatibilityOptions.UseOpenGLOrientationForUV = true;
            const newScene = new Scene(engine);

            newScene.clearColor = props.mxBackgroundColor?.value
                ? Color4.FromHexString(props.mxBackgroundColor?.value)
                : new Color4(1, 1, 1, 1);

            const camera = new ArcRotateCamera(
                "MainCamera",
                Tools.ToRadians(-90),
                Tools.ToRadians(70),
                Number(props.mxPreviewCameraDistance),
                new Vector3(props.mxPositionX.toNumber(), props.mxPositionY.toNumber(), props.mxPositionZ.toNumber()),
                newScene
            );

            camera.minZ = 0.1;
            // This targets the camera to scene origin
            light.current = new HemisphericLight("light", Vector3.Up(), newScene);

            setScene(newScene);

            // This attaches the camera to the canvas
            camera.attachControl(canvasRef.current, true);

            // Add a parent so scene can be rotated in preview mode.
            const newParent = new Mesh("ContainerARParent", newScene);
            setParent(newParent);
            setParentID(newParent.uniqueId);
            engine.runRenderLoop(() => {
                newScene.render();
            });

            if (parent) {
                parent.rotation = Vector3.Zero();
            }

            const instantiateWebXR = async () => {
                try {
                    // Check if WebXR is available in the browser
                    if (!navigator.xr) {
                        console.log("WebXR not supported in this browser");
                        return;
                    }

                    const supportedAR = await WebXRSessionManager.IsSessionSupportedAsync("immersive-ar");
                    console.log("is immersive-ar supported? " + supportedAR);

                    const defaultXRExperience = await newScene.createDefaultXRExperienceAsync({
                        uiOptions: {
                            sessionMode: supportedAR ? "immersive-ar" : "immersive-vr"
                        },
                        optionalFeatures: true
                    });

                    // Check if WebXR experience was created successfully
                    if (defaultXRExperience && defaultXRExperience.baseExperience) {
                        defaultXRExperience.baseExperience.onStateChangedObservable.add((state: WebXRState) => {
                            if (state === WebXRState.ENTERING_XR) {
                                skyboxRef.current?.setEnabled(false);
                                xrActiveRef.current = true;
                            } else if (state === WebXRState.EXITING_XR) {
                                skyboxRef.current?.setEnabled(true);
                                xrActiveRef.current = false;
                            }
                        });

                        setCamera(defaultXRExperience.baseExperience.camera);
                        console.log("XR supported, state: " + defaultXRExperience.baseExperience.state);
                    } else {
                        console.log("Failed to create WebXR experience - WebXR may not be supported");
                    }
                } catch (error) {
                    console.error("WebXR initialization failed:", error);
                    console.log("Continuing without WebXR support");
                }
            };
            instantiateWebXR();
        }

        // Cleanup function to dispose of Babylon resources
        return () => {
            try {
                if (engineRef.current) {
                    engineRef.current.dispose();
                }
                if (scene) {
                    scene.dispose();
                }
            } catch (error) {
                console.error("Error during cleanup:", error);
            }
        };
    }, []); // Empty dependency - should only run once on mount

    return (
        <EngineContext.Provider
            value={{
                scene,
                camera
            }}
        >
            <div id="reader" />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
            <div style={{ flex: 1 }}>
                <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", ...props.style }} />
            </div>
        </EngineContext.Provider>
    );
}
