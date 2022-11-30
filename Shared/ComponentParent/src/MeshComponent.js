import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Color3, WebXRFeatureName, Vector3, StandardMaterial, PBRMetallicRoughnessMaterial, ActionManager, ExecuteCodeAction } from "@babylonjs/core";
export function MeshComponent(props) {
    const { mxPositionType, mxPositionXStat, mxPositionYStat, mxPositionZStat, mxPositionXAtt, mxPositionYAtt, mxPositionZAtt, mxPositionXExpr, mxPositionYExpr, mxPositionZExpr, mxRotationType, mxRotationXStat, mxRotationYStat, mxRotationZStat, mxRotationXAtt, mxRotationYAtt, mxRotationZAtt, mxRotationXExpr, mxRotationYExpr, mxRotationZExpr, mxScaleType, mxScaleXStat, mxScaleYStat, mxScaleZStat, mxScaleXAtt, mxScaleYAtt, mxScaleZAtt, mxScaleXExpr, mxScaleYExpr, mxScaleZExpr, mxOpacity, mxMaterialOption, mxMaterialColor, mxLightingType, mxRoughness, mxMetalness, mxUseDraggingInteraction, mxDraggingEnabled, mxDragType, mxOnClick, mxOnDrag, mxOnHoverEnter, mxOnHoverExit, mxUsePinchInteraction, mxOnPinchActionValue, mxPinchEnabled, mxPinchToScaleEnabled, rootMesh, allMeshes, OnSceneLoaded } = props;
    const global = globalThis;
    const engineContext = useContext(global.EngineContext);
    const parentContext = useContext(global.ParentContext);
    const [position, setPosition] = useState(Vector3.Zero);
    const [rotation, setRotation] = useState(Vector3.Zero);
    const [scale, setScale] = useState(Vector3.One);
    const [startScale, setStartScale] = useState(Vector3.One);
    const meshRef = useRef();
    const setAction = (action, trigger, meshes) => {
        console.log("SET ACTION");
        meshes === null || meshes === void 0 ? void 0 : meshes.forEach(mesh => {
            if (mesh.actionManager === null) {
                mesh.actionManager = new ActionManager();
            }
            if (mesh.actionManager.actions.find(action => action.trigger === trigger) === undefined) {
                mesh.actionManager.registerAction(new ExecuteCodeAction(trigger, () => {
                    console.log("ACTION CALLED");
                    if (action === null || action === void 0 ? void 0 : action.canExecute) {
                        action.execute();
                    }
                }));
            }
        });
    };
    useEffect(() => {
        console.log("mxOnClick, allMeshes " + mxOnClick + "" + allMeshes);
        if ((mxOnClick === null || mxOnClick === void 0 ? void 0 : mxOnClick.canExecute) && allMeshes !== undefined) {
            console.log("REGISTER CLICK");
            setAction(mxOnClick, ActionManager.OnPickTrigger, allMeshes);
        }
    }, [mxOnClick, allMeshes]);
    useEffect(() => {
        if ((mxOnHoverEnter === null || mxOnHoverEnter === void 0 ? void 0 : mxOnHoverEnter.canExecute) && allMeshes !== undefined) {
            setAction(mxOnHoverEnter, ActionManager.OnPointerOverTrigger, allMeshes);
        }
    }, [mxOnHoverEnter, allMeshes]);
    useEffect(() => {
        if ((mxOnHoverExit === null || mxOnHoverExit === void 0 ? void 0 : mxOnHoverExit.canExecute) && allMeshes !== undefined) {
            setAction(mxOnHoverExit, ActionManager.OnPointerOutTrigger, allMeshes);
        }
    }, [mxOnHoverExit, allMeshes]);
    useEffect(() => {
        if (engineContext.scene) {
            OnSceneLoaded(engineContext.scene);
        }
    }, [engineContext.scene]);
    useEffect(() => {
        var _a;
        if (rootMesh && !meshRef.current)
            meshRef.current = rootMesh;
        if (rootMesh && !isNaN(parentContext)) {
            const localParentMesh = (_a = engineContext.scene) === null || _a === void 0 ? void 0 : _a.getMeshByUniqueId(parentContext);
            if (localParentMesh) {
                rootMesh.parent = localParentMesh;
            }
        }
    }, [rootMesh, parentContext, engineContext.scene]);
    useEffect(() => {
        return () => {
            var _a;
            (_a = meshRef.current) === null || _a === void 0 ? void 0 : _a.dispose();
        };
    }, []);
    //#region Translation(position, rotation, scale)
    useEffect(() => {
        if (rootMesh && engineContext.scaleState === 0 /* State.ACTIVE */) {
            setStartScale(rootMesh.scaling.clone());
        }
    }, [engineContext.scaleState]);
    useEffect(() => {
        if (rootMesh) {
            rootMesh.position.x = position.x;
            rootMesh.position.y = position.y;
            rootMesh.position.z = position.z;
        }
    }, [position, engineContext.xrActive, rootMesh]);
    useEffect(() => {
        if (rootMesh) {
            rootMesh.rotation.x = rotation.x * (Math.PI / 180);
            rootMesh.rotation.y = rotation.y * (Math.PI / 180);
            rootMesh.rotation.z = rotation.z * (Math.PI / 180);
        }
    }, [rotation, engineContext.xrActive, rootMesh]);
    useEffect(() => {
        if (rootMesh) {
            rootMesh.scaling.x = scale.x;
            rootMesh.scaling.y = scale.y;
            rootMesh.scaling.z = scale.z;
        }
    }, [scale, engineContext.xrActive, rootMesh]);
    useEffect(() => {
        if (mxPositionType === "Attribute") {
            if ((mxPositionXAtt === null || mxPositionXAtt === void 0 ? void 0 : mxPositionXAtt.status) === "available" /* ValueStatus.Available */ &&
                (mxPositionYAtt === null || mxPositionYAtt === void 0 ? void 0 : mxPositionYAtt.status) === "available" /* ValueStatus.Available */ &&
                (mxPositionZAtt === null || mxPositionZAtt === void 0 ? void 0 : mxPositionZAtt.status) === "available" /* ValueStatus.Available */) {
                setPosition(new Vector3(Number(mxPositionXAtt.value), Number(mxPositionYAtt.value), Number(mxPositionZAtt.value)));
            }
        }
        else if (mxPositionType === "Expression") {
            if ((mxPositionXExpr === null || mxPositionXExpr === void 0 ? void 0 : mxPositionXExpr.status) === "available" /* ValueStatus.Available */ &&
                (mxPositionYExpr === null || mxPositionYExpr === void 0 ? void 0 : mxPositionYExpr.status) === "available" /* ValueStatus.Available */ &&
                (mxPositionZExpr === null || mxPositionZExpr === void 0 ? void 0 : mxPositionZExpr.status) === "available" /* ValueStatus.Available */) {
                setPosition(new Vector3(Number(mxPositionXExpr.value), Number(mxPositionYExpr.value), Number(mxPositionZExpr.value)));
            }
        }
        else if (mxPositionType === "Static") {
            if (mxPositionXStat && mxPositionYStat && mxPositionZStat) {
                setPosition(new Vector3(Number(mxPositionXStat), Number(mxPositionYStat), Number(mxPositionZStat)));
            }
        }
    }, [
        mxPositionType,
        mxPositionXAtt,
        mxPositionYAtt,
        mxPositionZAtt,
        mxPositionXExpr,
        mxPositionYExpr,
        mxPositionZExpr,
        engineContext.scene
    ]);
    useEffect(() => {
        if (mxRotationType === "Attribute") {
            if ((mxRotationXAtt === null || mxRotationXAtt === void 0 ? void 0 : mxRotationXAtt.status) === "available" /* ValueStatus.Available */ &&
                (mxRotationYAtt === null || mxRotationYAtt === void 0 ? void 0 : mxRotationYAtt.status) === "available" /* ValueStatus.Available */ &&
                (mxRotationZAtt === null || mxRotationZAtt === void 0 ? void 0 : mxRotationZAtt.status) === "available" /* ValueStatus.Available */) {
                setRotation(new Vector3(Number(mxRotationXAtt.value), Number(mxRotationYAtt.value), Number(mxRotationZAtt.value)));
            }
        }
        else if (mxRotationType === "Expression") {
            if ((mxRotationXExpr === null || mxRotationXExpr === void 0 ? void 0 : mxRotationXExpr.status) === "available" /* ValueStatus.Available */ &&
                (mxRotationYExpr === null || mxRotationYExpr === void 0 ? void 0 : mxRotationYExpr.status) === "available" /* ValueStatus.Available */ &&
                (mxRotationZExpr === null || mxRotationZExpr === void 0 ? void 0 : mxRotationZExpr.status) === "available" /* ValueStatus.Available */) {
                setRotation(new Vector3(Number(mxRotationXExpr.value), Number(mxRotationYExpr.value), Number(mxRotationZExpr.value)));
            }
        }
        else if (mxRotationType === "Static") {
            if (mxRotationXStat && mxRotationYStat && mxRotationZStat) {
                setRotation(new Vector3(Number(mxRotationXStat), Number(mxRotationYStat), Number(mxRotationZStat)));
            }
        }
    }, [
        mxRotationType,
        mxRotationXAtt,
        mxRotationYAtt,
        mxRotationZAtt,
        mxRotationXExpr,
        mxRotationYExpr,
        mxRotationZExpr,
        engineContext.scene
    ]);
    useEffect(() => {
        if (mxScaleType === "Attribute") {
            if ((mxScaleXAtt === null || mxScaleXAtt === void 0 ? void 0 : mxScaleXAtt.status) === "available" /* ValueStatus.Available */ &&
                (mxScaleYAtt === null || mxScaleYAtt === void 0 ? void 0 : mxScaleYAtt.status) === "available" /* ValueStatus.Available */ &&
                (mxScaleZAtt === null || mxScaleZAtt === void 0 ? void 0 : mxScaleZAtt.status) === "available" /* ValueStatus.Available */) {
                setScale(new Vector3(Number(mxScaleXAtt.value), Number(mxScaleYAtt.value), Number(mxScaleZAtt.value)));
            }
        }
        else if (mxScaleType === "Expression") {
            if ((mxScaleXExpr === null || mxScaleXExpr === void 0 ? void 0 : mxScaleXExpr.status) === "available" /* ValueStatus.Available */ &&
                (mxScaleYExpr === null || mxScaleYExpr === void 0 ? void 0 : mxScaleYExpr.status) === "available" /* ValueStatus.Available */ &&
                (mxScaleZExpr === null || mxScaleZExpr === void 0 ? void 0 : mxScaleZExpr.status) === "available" /* ValueStatus.Available */) {
                setScale(new Vector3(Number(mxScaleXExpr.value), Number(mxScaleYExpr.value), Number(mxScaleZExpr.value)));
            }
        }
        else if (mxScaleType === "Static") {
            if (mxScaleXStat && mxScaleYStat && mxScaleZStat) {
                setScale(new Vector3(Number(mxScaleXStat), Number(mxScaleYStat), Number(mxScaleZStat)));
            }
        }
    }, [
        mxScaleType,
        mxScaleXAtt,
        mxScaleYAtt,
        mxScaleZAtt,
        mxScaleXExpr,
        mxScaleYExpr,
        mxScaleZExpr,
        engineContext.scene
    ]);
    //#endregion
    //#region Material
    useEffect(() => {
        //This sets up all the  material information for the mesh
        if (allMeshes && rootMesh && engineContext.scene) {
            let color;
            rootMesh.visibility = Number(mxOpacity === null || mxOpacity === void 0 ? void 0 : mxOpacity.value);
            if (mxMaterialOption === "Color" && mxMaterialColor) {
                color = Color3.FromHexString(mxMaterialColor);
            }
            allMeshes === null || allMeshes === void 0 ? void 0 : allMeshes.forEach(childMesh => {
                if (mxLightingType === "PBR" && mxMaterialOption !== "Object") {
                    handlePBRMaterial(childMesh, color, props.texture);
                }
                if (mxLightingType === "Simple" && mxMaterialOption !== "Object") {
                    handleSimpleMaterial(childMesh, color, props.texture);
                }
            });
        }
    }, [mxMaterialColor, props.texture, allMeshes, engineContext.scene]);
    const handlePBRMaterial = (mesh, color, texture) => {
        if (engineContext.scene) {
            if (!(mesh.material instanceof PBRMetallicRoughnessMaterial)) {
                mesh.material = new PBRMetallicRoughnessMaterial(mesh.name + "Material", engineContext.scene);
            }
            if (mesh.material instanceof PBRMetallicRoughnessMaterial) {
                if (color) {
                    mesh.material.baseColor = color;
                }
                else if (texture) {
                    mesh.material.baseTexture = texture;
                }
                if ((mxRoughness === null || mxRoughness === void 0 ? void 0 : mxRoughness.status) === "available" /* ValueStatus.Available */) {
                    mesh.material.roughness = Number(mxRoughness.value);
                }
                if ((mxMetalness === null || mxMetalness === void 0 ? void 0 : mxMetalness.status) === "available" /* ValueStatus.Available */) {
                    mesh.material.metallic = Number(mxMetalness.value);
                }
            }
        }
    };
    const handleSimpleMaterial = (mesh, color, texture) => {
        if (engineContext.scene) {
            if (!(mesh.material instanceof StandardMaterial)) {
                mesh.material = new StandardMaterial(mesh.name + "Material", engineContext.scene);
            }
            if (mesh.material instanceof StandardMaterial) {
                if (color) {
                    mesh.material.diffuseColor = color;
                }
                else if (texture) {
                    mesh.material.diffuseTexture = texture;
                }
            }
        }
    };
    useEffect(() => {
        allMeshes === null || allMeshes === void 0 ? void 0 : allMeshes.forEach(childMesh => {
            if (mxOpacity === null || mxOpacity === void 0 ? void 0 : mxOpacity.value) {
                childMesh.visibility = Number(mxOpacity.value);
            }
        });
    }, [mxOpacity === null || mxOpacity === void 0 ? void 0 : mxOpacity.value, allMeshes]);
    useEffect(() => {
        allMeshes === null || allMeshes === void 0 ? void 0 : allMeshes.forEach(childMesh => {
            if ((mxRoughness === null || mxRoughness === void 0 ? void 0 : mxRoughness.value) && childMesh && childMesh.material instanceof PBRMetallicRoughnessMaterial) {
                childMesh.material.roughness = Number(mxRoughness.value);
            }
        });
    }, [mxRoughness === null || mxRoughness === void 0 ? void 0 : mxRoughness.value, allMeshes]);
    useEffect(() => {
        allMeshes === null || allMeshes === void 0 ? void 0 : allMeshes.forEach(childMesh => {
            if ((mxMetalness === null || mxMetalness === void 0 ? void 0 : mxMetalness.value) && childMesh && childMesh.material instanceof PBRMetallicRoughnessMaterial) {
                childMesh.material.metallic = Number(mxMetalness.value);
            }
        });
    }, [mxMetalness === null || mxMetalness === void 0 ? void 0 : mxMetalness.value, allMeshes]);
    //#endregion
    //#region Interaction
    useEffect(() => {
        var _a, _b, _c;
        //Handles dragging behaviour on mesh
        if (rootMesh && engineContext.scene && engineContext.xrActive) {
            if (mxDraggingEnabled && mxUseDraggingInteraction && engineContext.featuresManager) {
                if (mxDragType === "FixedToWorld") {
                    const hitTest = (_a = engineContext.featuresManager) === null || _a === void 0 ? void 0 : _a.enableFeature(WebXRFeatureName.HIT_TEST, "latest", {
                        offsetRay: {
                            origin: { x: 0, y: 0, z: 0 },
                            direction: { x: 0, y: 0, z: -1 }
                        }
                    });
                    if (hitTest) {
                        if ((mxOnDrag === null || mxOnDrag === void 0 ? void 0 : mxOnDrag.canExecute) && !mxOnDrag.isExecuting) {
                            mxOnDrag.execute();
                        }
                        hitTest.onHitTestResultObservable.add(eventData => {
                            if (rootMesh) {
                                eventData.map(result => {
                                    rootMesh.position = result.position;
                                });
                            }
                        });
                    }
                }
                else if (mxDragType === "FixedDistance") {
                    rootMesh.parent = engineContext.scene.activeCamera;
                    if ((mxOnDrag === null || mxOnDrag === void 0 ? void 0 : mxOnDrag.canExecute) && !mxOnDrag.isExecuting) {
                        mxOnDrag.execute();
                    }
                }
            }
            if (!mxDraggingEnabled && mxUseDraggingInteraction) {
                if (mxDragType === "FixedToWorld") {
                    (_b = engineContext.featuresManager) === null || _b === void 0 ? void 0 : _b.detachFeature(WebXRFeatureName.HIT_TEST);
                }
                else if (mxDragType === "FixedDistance" && parentContext) {
                    const parentMesh = (_c = engineContext.scene) === null || _c === void 0 ? void 0 : _c.getMeshByUniqueId(parentContext);
                    if (parentMesh) {
                        rootMesh.parent = parentMesh;
                    }
                }
            }
        }
    }, [rootMesh, engineContext.scene, mxDraggingEnabled, engineContext.featuresManager, engineContext.xrActive]);
    useEffect(() => {
        if ((rootMesh === null || rootMesh === void 0 ? void 0 : rootMesh.scaling) && mxUsePinchInteraction && mxPinchToScaleEnabled && mxPinchEnabled) {
            rootMesh.scaling.x = startScale.x * engineContext.pinchScale;
            rootMesh.scaling.y = startScale.y * engineContext.pinchScale;
            rootMesh.scaling.z = startScale.z * engineContext.pinchScale;
        }
        if (mxPinchEnabled && mxUsePinchInteraction && (mxOnPinchActionValue === null || mxOnPinchActionValue === void 0 ? void 0 : mxOnPinchActionValue.canExecute)) {
            mxOnPinchActionValue.execute();
        }
    }, [engineContext.pinchScale]);
    //#endregion
    return React.createElement(Fragment, null);
}
//# sourceMappingURL=MeshComponent.js.map