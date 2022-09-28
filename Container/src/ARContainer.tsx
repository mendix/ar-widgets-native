import React, { createElement, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Style } from "@mendix/pluggable-widgets-tools";
import { ARContainerProps } from "../typings/ARContainerProps";
import { flattenStyles } from "../../ComponentParent/utils/styles";
import { defaultViewStyle } from "../ui/Styles";
import { FocusDetectingNavigator } from "../../ComponentParent/src/FocusDetectingNavigator";
import { EngineView, useEngine } from "@babylonjs/react-native";
import {
    Scene,
    Vector3,
    Camera,
    WebXRFeaturesManager,
    WebXRSessionManager,
    WebXRTrackingState,
    ArcRotateCamera,
    HemisphericLight,
    DeviceSource,
    DeviceSourceManager,
    DeviceType,
    PointerInput,
    Mesh,
    CubeTexture,
    Tools,
    IMouseEvent,
    WebXRFeatureName,
    WebXRImageTracking,
    IWebXRTrackedImage,
    Matrix
} from "@babylonjs/core";
import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation";
import {
    PinchGestureHandler,
    State,
    PinchGestureHandlerGestureEvent,
    PinchGestureHandlerStateChangeEvent
} from "react-native-gesture-handler";
import { ValueStatus } from "mendix";
import { EngineContext, ParentContext } from "../../ComponentParent/src/EngineContext";

export const ARContainer = (props: ARContainerProps<Style> & { mxVisible: boolean }): JSX.Element => {
    const engine = useEngine();
    const styles = flattenStyles(defaultViewStyle, props.style);
    const pinchRef = React.createRef<PinchGestureHandler>();
    const [inPreview, setInPreview] = useState<boolean>();
    const [camera, setCamera] = useState<Camera>();
    const [scene, setScene] = useState<Scene>();
    const [xrSession, setXrSession] = useState<WebXRSessionManager>();
    const [trackingState, setTrackingState] = useState<WebXRTrackingState>();
    const [parent, setParent] = useState<Mesh | undefined>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [xrActive, setXrActive] = useState<boolean>(false);
    const [deviceTouch, setDeviceTouch] = useState<DeviceSource<DeviceType.Touch>>();
    const [touchRotation, setTouchRotation] = useState<number>();
    const [featuresManager, setFeaturesManager] = useState<WebXRFeaturesManager>();
    const [focus, setFocus] = useState<boolean>(true);
    const [scaleState, setScaleState] = useState<State>(State.UNDETERMINED);
    const [pinchScale, setPinchScale] = useState<number>();
    const [pickedIDClicked, setPickedIDClicked] = useState<number[]>([]);
    const [hoveringMeshID, setHoveringMeshID] = useState<number>();
    const [pickedHoveredMeshID, setPickedHoveredMeshID] = useState<number>(NaN);
    const [imageTrackingOptions, setImageTrackingOptions] = useState<
        Array<{
            src: string;
            estimatedRealWorldWidth: number;
        }>
    >();
    const [trackedImageLocation, setTrackedImageLocation] = useState<{ src: string; matrix: Matrix }>();
    const [clickedCoordinates, setClickedCoordinates] = useState<{ x: number; y: number }>();

    const handleNavigationLoaded = (
        navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
    ) => {
        navigation.addListener("willBlur", () => {
            setFocus(false);
        });
        navigation.addListener("willFocus", () => {
            setFocus(true);
        });
    };

    const startNewScene = () => {
        if (engine) {
            const newScene = engine.scenes.length > 0 ? engine.scenes[0] : new Scene(engine);
            // If the engine is loaded, create a scene that we can use to add our 3D objects to. The scene can be seen as a canvas other stuff is rendered on.
            setScene(newScene);
            // Add a parent so scene can be rotated in preview mode.
            const newParent = new Mesh("ContainerARParent", newScene);
            setParent(newParent);
            setParentID(newParent.uniqueId);
            const deviceManager = new DeviceSourceManager(engine);
            deviceManager.onDeviceConnectedObservable.add((device: DeviceSource<DeviceType>) => {
                if (device === null) {
                    console.log("device is null");
                    return;
                }
                if (device.deviceType === DeviceType.Touch) {
                    const touch: DeviceSource<DeviceType.Touch> = deviceManager.getDeviceSource(
                        device.deviceType,
                        device.deviceSlot
                    )!;
                    setDeviceTouch(touch);
                }
            });
            deviceManager.onDeviceDisconnectedObservable.add(eventData => {
                if (eventData === null) {
                    console.log("eventData is null");
                    return;
                }
                if (eventData.deviceType === DeviceType.Touch) {
                    setDeviceTouch(undefined);
                }
            });
            newScene.onAfterRenderObservable.add(() => {
                const picked = newScene.pick(
                    newScene.getEngine().getRenderWidth() / 2,
                    newScene.getEngine().getRenderHeight() / 2
                );
                if (picked?.hit && picked?.pickedMesh) {
                    setPickedHoveredMeshID(picked.pickedMesh.uniqueId);
                } else {
                    setPickedHoveredMeshID(NaN);
                }
            });
        }
    };

    useEffect(() => {
        if (props.mxUsePreview && inPreview === undefined) {
            setInPreview(props.mxUsePreview);
        }
    }, [props.mxUsePreview]);

    useEffect(() => {
        if (xrActive && focus) {
            setHoveringMeshID(pickedHoveredMeshID);
        }
    }, [pickedHoveredMeshID]);

    useEffect(() => {
        if (engine) {
            startNewScene();
        }
    }, [engine]);

    // #region Scene settings
    useEffect(() => {
        if (scene && engine) {
            let localCamera: Camera;
            if (props.mxUsePreview) {
                // Create a camera with a set distance from the 3D objects
                localCamera = new ArcRotateCamera(
                    "MainCamera",
                    Tools.ToRadians(-90),
                    Tools.ToRadians(70),
                    Number(props.mxPreviewCameraDistance),
                    new Vector3(0, 0, 0),
                    scene
                );
                localCamera.minZ = 0.1;
                setInPreview(true);
            } else {
                localCamera = new Camera("MainCamera", new Vector3(0, 0, 0), scene);
                onToggleXr();
                setInPreview(false);
            }
            new HemisphericLight("light", Vector3.Up(), scene);
            scene.activeCamera = localCamera;
            setCamera(localCamera);
        }
    }, [scene]);

    useEffect(() => {
        // If we want realistic lighting, use the provided environment map
        if (scene && props.mxUsePBR && props.mxHdrPath?.status === ValueStatus.Available) {
            const hdrTexture = CubeTexture.CreateFromPrefilteredData(props.mxHdrPath.value, scene);
            scene.environmentTexture = hdrTexture;
        }
    }, [scene, props.mxHdrPath]);
    // #endregion

    // #region Pinch events
    const onPinchGestureEvent: (event: PinchGestureHandlerGestureEvent) => void = event => {
        setPinchScale(event.nativeEvent.scale);
    };
    const onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
        setScaleState(event.nativeEvent.state);
    };
    // #endregion

    useEffect(() => {
        if (touchRotation && parent && inPreview && !xrActive && focus) {
            parent.rotate(Vector3.Down(), touchRotation);
        }
    }, [touchRotation, parent]);

    useEffect(() => {
        if (deviceTouch) {
            deviceTouch?.onInputChangedObservable.add((event: IMouseEvent) => {
                if (event.inputIndex === PointerInput.Move && event.movementX) {
                    setTouchRotation(event.movementX / 100);
                } else if (event.inputIndex === PointerInput.LeftClick) {
                    setClickedCoordinates({ x: event.clientX, y: event.clientY });
                }
            });
        }
    }, [deviceTouch]);

    useEffect(() => {
        if (clickedCoordinates && focus) {
            const picked = scene?.pick(clickedCoordinates.x, clickedCoordinates.y);
            if (picked?.pickedMesh) {
                setPickedIDClicked(pickedIDs => [...pickedIDs, picked.pickedMesh!.uniqueId]);
            }
        }
    }, [clickedCoordinates]);
    // #endregion

    // #region XR settings
    const onToggleXr = () => {
        (async () => {
            if (xrSession) {
                setInPreview(true);
                await xrSession.exitXRAsync().then(() => {
                    setXrActive(false);
                });
            } else if (scene !== undefined) {
                // Create XR session, and add to our current camera.
                const xr = await scene.createDefaultXRExperienceAsync({
                    disableDefaultUI: true,
                    disableTeleportation: true,
                    optionalFeatures: true
                });
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
                const session = await xr.baseExperience.enterXRAsync("immersive-ar", "unbounded", xr.renderTarget);
                setXrSession(session);

                session.onXRSessionEnded.add(() => {
                    setXrSession(undefined);
                    setTrackingState(undefined);
                });
                scene.activeCamera = xr.baseExperience.camera;
                setTrackingState(xr.baseExperience.camera.trackingState);
                xr.baseExperience.camera.onTrackingStateChanged.add((newTrackingState: WebXRTrackingState) => {
                    setTrackingState(newTrackingState);
                });
                setXrActive(true);
                setInPreview(false);
                if (parent) {
                    parent.rotation = Vector3.Zero();
                }
            }
        })();
    };

    // #endregion

    return (
        <EngineContext.Provider
            value={{
                scene,
                featuresManager,
                xrActive,
                scaleState,
                pinchScale,
                pickedIDClicked,
                setPickedIDClicked,
                hoveringMeshID,
                ParentContext,
                setImageTrackingOptions,
                trackedImageLocation
            }}
        >
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
            {props.mxUsePreview ? (
                <Pressable style={styles.button} onPress={onToggleXr}>
                    <Text style={styles.buttonText}>{xrSession ? "Stop XR" : "Start XR"}</Text>
                </Pressable>
            ) : null}
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}
            >
                <View style={styles.container}>
                    <EngineView style={{ flex: 1 }} camera={camera} />
                    <FocusDetectingNavigator OnNavigationLoaded={handleNavigationLoaded} />
                    <Text style={styles.debugText}>
                        {trackingState === undefined ? "" : WebXRTrackingState[trackingState]}
                    </Text>
                </View>
            </PinchGestureHandler>
        </EngineContext.Provider>
    );
};
