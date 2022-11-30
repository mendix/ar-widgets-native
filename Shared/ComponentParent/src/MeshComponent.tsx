import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { MeshComponentProps } from "../typings/MeshComponentProps";
import {
    Color3,
    Texture,
    WebXRFeatureName,
    WebXRHitTest,
    Vector3,
    Mesh,
    Scene,
    StandardMaterial,
    PBRMetallicRoughnessMaterial,
    ActionManager,
    ExecuteCodeAction
} from "@babylonjs/core";
import { ValueStatus, ActionValue } from "mendix";
import { EngineContext, GlobalContext, State } from "../typings/GlobalContextProps";

export function MeshComponent(
    props: {
        rootMesh?: Mesh;
        allMeshes?: Mesh[];
        texture?: Texture;
        OnSceneLoaded: (scene: Scene) => void;
    } & MeshComponentProps
): React.ReactElement {
    const {
        mxPositionType,
        mxPositionXStat,
        mxPositionYStat,
        mxPositionZStat,
        mxPositionXAtt,
        mxPositionYAtt,
        mxPositionZAtt,
        mxPositionXExpr,
        mxPositionYExpr,
        mxPositionZExpr,
        mxRotationType,
        mxRotationXStat,
        mxRotationYStat,
        mxRotationZStat,
        mxRotationXAtt,
        mxRotationYAtt,
        mxRotationZAtt,
        mxRotationXExpr,
        mxRotationYExpr,
        mxRotationZExpr,
        mxScaleType,
        mxScaleXStat,
        mxScaleYStat,
        mxScaleZStat,
        mxScaleXAtt,
        mxScaleYAtt,
        mxScaleZAtt,
        mxScaleXExpr,
        mxScaleYExpr,
        mxScaleZExpr,
        mxOpacity,
        mxMaterialOption,
        mxMaterialColor,
        mxLightingType,
        mxRoughness,
        mxMetalness,
        mxUseDraggingInteraction,
        mxDraggingEnabled,
        mxDragType,
        mxOnClick,
        mxOnDrag,
        mxOnHoverEnter,
        mxOnHoverExit,
        mxUsePinchInteraction,
        mxOnPinchActionValue,
        mxPinchEnabled,
        mxPinchToScaleEnabled,
        rootMesh,
        allMeshes,
        OnSceneLoaded
    } = props;
    const global = globalThis;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const parentContext: number = useContext((global as GlobalContext).ParentContext);
    const [position, setPosition] = useState<Vector3>(Vector3.Zero);
    const [rotation, setRotation] = useState<Vector3>(Vector3.Zero);
    const [scale, setScale] = useState<Vector3>(Vector3.One);
    const [startScale, setStartScale] = useState<Vector3>(Vector3.One);
    const meshRef = useRef<Mesh>();
    const setAction = (action: ActionValue, trigger: number, meshes: Mesh[]) => {
        console.log("SET ACTION");
        meshes?.forEach(mesh => {
            if (mesh.actionManager === null) {
                mesh.actionManager = new ActionManager();
            }
            if (mesh.actionManager.actions.find(action => action.trigger === trigger) === undefined) {
                mesh.actionManager.registerAction(
                    new ExecuteCodeAction(trigger, () => {
                        console.log("ACTION CALLED");
                        if (action?.canExecute) {
                            action.execute();
                        }
                    })
                );
            }
        });
    };

    useEffect(() => {
        console.log("mxOnClick, allMeshes " + mxOnClick + "" + allMeshes);
        if (mxOnClick?.canExecute && allMeshes !== undefined) {
            console.log("REGISTER CLICK");
            setAction(mxOnClick, ActionManager.OnPickTrigger, allMeshes);
        }
    }, [mxOnClick, allMeshes]);

    useEffect(() => {
        if (mxOnHoverEnter?.canExecute && allMeshes !== undefined) {
            setAction(mxOnHoverEnter, ActionManager.OnPointerOverTrigger, allMeshes);
        }
    }, [mxOnHoverEnter, allMeshes]);

    useEffect(() => {
        if (mxOnHoverExit?.canExecute && allMeshes !== undefined) {
            setAction(mxOnHoverExit, ActionManager.OnPointerOutTrigger, allMeshes);
        }
    }, [mxOnHoverExit, allMeshes]);

    useEffect(() => {
        if (engineContext.scene) {
            OnSceneLoaded(engineContext.scene);
        }
    }, [engineContext.scene]);

    useEffect(() => {
        if (rootMesh && !meshRef.current) meshRef.current = rootMesh;
        if (rootMesh && !isNaN(parentContext)) {
            const localParentMesh = engineContext.scene?.getMeshByUniqueId(parentContext);
            if (localParentMesh) {
                rootMesh.setParent(localParentMesh);
            }
        }
    }, [rootMesh, parentContext, engineContext.scene]);

    useEffect(() => {
        return () => {
            meshRef.current?.dispose();
        };
    }, []);

    //#region Translation(position, rotation, scale)
    useEffect(() => {
        if (rootMesh && engineContext.scaleState === State.ACTIVE) {
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
            if (
                mxPositionXAtt?.status === ValueStatus.Available &&
                mxPositionYAtt?.status === ValueStatus.Available &&
                mxPositionZAtt?.status === ValueStatus.Available
            ) {
                setPosition(
                    new Vector3(
                        Number(mxPositionXAtt.value),
                        Number(mxPositionYAtt.value),
                        Number(mxPositionZAtt.value)
                    )
                );
            }
        } else if (mxPositionType === "Expression") {
            if (
                mxPositionXExpr?.status === ValueStatus.Available &&
                mxPositionYExpr?.status === ValueStatus.Available &&
                mxPositionZExpr?.status === ValueStatus.Available
            ) {
                setPosition(
                    new Vector3(
                        Number(mxPositionXExpr.value),
                        Number(mxPositionYExpr.value),
                        Number(mxPositionZExpr.value)
                    )
                );
            }
        } else if (mxPositionType === "Static") {
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
            if (
                mxRotationXAtt?.status === ValueStatus.Available &&
                mxRotationYAtt?.status === ValueStatus.Available &&
                mxRotationZAtt?.status === ValueStatus.Available
            ) {
                setRotation(
                    new Vector3(
                        Number(mxRotationXAtt.value),
                        Number(mxRotationYAtt.value),
                        Number(mxRotationZAtt.value)
                    )
                );
            }
        } else if (mxRotationType === "Expression") {
            if (
                mxRotationXExpr?.status === ValueStatus.Available &&
                mxRotationYExpr?.status === ValueStatus.Available &&
                mxRotationZExpr?.status === ValueStatus.Available
            ) {
                setRotation(
                    new Vector3(
                        Number(mxRotationXExpr.value),
                        Number(mxRotationYExpr.value),
                        Number(mxRotationZExpr.value)
                    )
                );
            }
        } else if (mxRotationType === "Static") {
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
            if (
                mxScaleXAtt?.status === ValueStatus.Available &&
                mxScaleYAtt?.status === ValueStatus.Available &&
                mxScaleZAtt?.status === ValueStatus.Available
            ) {
                setScale(new Vector3(Number(mxScaleXAtt.value), Number(mxScaleYAtt.value), Number(mxScaleZAtt.value)));
            }
        } else if (mxScaleType === "Expression") {
            if (
                mxScaleXExpr?.status === ValueStatus.Available &&
                mxScaleYExpr?.status === ValueStatus.Available &&
                mxScaleZExpr?.status === ValueStatus.Available
            ) {
                setScale(
                    new Vector3(Number(mxScaleXExpr.value), Number(mxScaleYExpr.value), Number(mxScaleZExpr.value))
                );
            }
        } else if (mxScaleType === "Static") {
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
            let color: Color3 | undefined;
            rootMesh.visibility = Number(mxOpacity?.value);
            if (mxMaterialOption === "Color" && mxMaterialColor) {
                color = Color3.FromHexString(mxMaterialColor);
            }
            allMeshes?.forEach(childMesh => {
                if (mxLightingType === "PBR" && mxMaterialOption !== "Object") {
                    handlePBRMaterial(childMesh, color, props.texture);
                }
                if (mxLightingType === "Simple" && mxMaterialOption !== "Object") {
                    handleSimpleMaterial(childMesh, color, props.texture);
                }
            });
        }
    }, [mxMaterialColor, props.texture, allMeshes, engineContext.scene]);

    const handlePBRMaterial = (mesh: Mesh, color?: Color3, texture?: Texture) => {
        if (engineContext.scene) {
            if (!(mesh.material instanceof PBRMetallicRoughnessMaterial)) {
                mesh.material = new PBRMetallicRoughnessMaterial(mesh.name + "Material", engineContext.scene);
            }
            if (mesh.material instanceof PBRMetallicRoughnessMaterial) {
                if (color) {
                    mesh.material.baseColor = color;
                } else if (texture) {
                    mesh.material.baseTexture = texture;
                }
                if (mxRoughness?.status === ValueStatus.Available) {
                    mesh.material.roughness = Number(mxRoughness.value);
                }
                if (mxMetalness?.status === ValueStatus.Available) {
                    mesh.material.metallic = Number(mxMetalness.value);
                }
            }
        }
    };

    const handleSimpleMaterial = (mesh: Mesh, color?: Color3, texture?: Texture) => {
        if (engineContext.scene) {
            if (!(mesh.material instanceof StandardMaterial)) {
                mesh.material = new StandardMaterial(mesh.name + "Material", engineContext.scene);
            }
            if (mesh.material instanceof StandardMaterial) {
                if (color) {
                    mesh.material.diffuseColor = color;
                } else if (texture) {
                    mesh.material.diffuseTexture = texture;
                }
            }
        }
    };

    useEffect(() => {
        allMeshes?.forEach(childMesh => {
            if (mxOpacity?.status === ValueStatus.Available) {
                childMesh.visibility = Number(mxOpacity.value);
            }
        });
    }, [mxOpacity?.value, allMeshes]);

    useEffect(() => {
        allMeshes?.forEach(childMesh => {
            if (mxRoughness?.value && childMesh && childMesh.material instanceof PBRMetallicRoughnessMaterial) {
                childMesh.material.roughness = Number(mxRoughness.value);
            }
        });
    }, [mxRoughness?.value, allMeshes]);

    useEffect(() => {
        allMeshes?.forEach(childMesh => {
            if (mxMetalness?.value && childMesh && childMesh.material instanceof PBRMetallicRoughnessMaterial) {
                childMesh.material.metallic = Number(mxMetalness.value);
            }
        });
    }, [mxMetalness?.value, allMeshes]);
    //#endregion

    //#region Interaction
    useEffect(() => {
        //Handles dragging behaviour on mesh
        if (rootMesh && engineContext.scene && engineContext.xrActive) {
            if (mxDraggingEnabled && mxUseDraggingInteraction && engineContext.featuresManager) {
                if (mxDragType === "FixedToWorld") {
                    const hitTest = engineContext.featuresManager?.enableFeature(WebXRFeatureName.HIT_TEST, "latest", {
                        offsetRay: {
                            origin: { x: 0, y: 0, z: 0 },
                            direction: { x: 0, y: 0, z: -1 }
                        }
                    }) as WebXRHitTest;
                    if (hitTest) {
                        if (mxOnDrag?.canExecute && !mxOnDrag.isExecuting) {
                            mxOnDrag.execute();
                        }
                        hitTest.onHitTestResultObservable.add(eventData => {
                            if (rootMesh) {
                                eventData.map(result => {
                                    rootMesh!.position = result.position;
                                });
                            }
                        });
                    }
                } else if (mxDragType === "FixedDistance") {
                    rootMesh.setParent(engineContext.scene.activeCamera);
                    if (mxOnDrag?.canExecute && !mxOnDrag.isExecuting) {
                        mxOnDrag.execute();
                    }
                }
            }
            if (!mxDraggingEnabled && mxUseDraggingInteraction) {
                if (mxDragType === "FixedToWorld") {
                    engineContext.featuresManager?.detachFeature(WebXRFeatureName.HIT_TEST);
                } else if (mxDragType === "FixedDistance" && parentContext) {
                    const parentMesh = engineContext.scene?.getMeshByUniqueId(parentContext);
                    if (parentMesh) {
                        rootMesh.setParent(parentMesh);
                    }
                }
            }
        }
    }, [rootMesh, engineContext.scene, mxDraggingEnabled, engineContext.featuresManager, engineContext.xrActive]);

    useEffect(() => {
        if (rootMesh?.scaling && mxUsePinchInteraction && mxPinchToScaleEnabled && mxPinchEnabled) {
            rootMesh.scaling.x = startScale.x * engineContext.pinchScale;
            rootMesh.scaling.y = startScale.y * engineContext.pinchScale;
            rootMesh.scaling.z = startScale.z * engineContext.pinchScale;
        }
        if (mxPinchEnabled && mxUsePinchInteraction && mxOnPinchActionValue?.canExecute) {
            mxOnPinchActionValue.execute();
        }
    }, [engineContext.pinchScale]);

    //#endregion

    return <Fragment />;
}
