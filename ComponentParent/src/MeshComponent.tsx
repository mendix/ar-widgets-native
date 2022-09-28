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
    PBRMetallicRoughnessMaterial
} from "@babylonjs/core";
import { Image } from "react-native";
import { State } from "react-native-gesture-handler";
import { ValueStatus } from "mendix";
import { EngineContext, GlobalContext } from "../typings/GlobalContextProps";

export function MeshComponent(
    props: {
        mesh?: Mesh;
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
        mxMaterialTexture,
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
        mesh,
        OnSceneLoaded
    } = props;
    const engineContext: EngineContext = useContext((global as GlobalContext).EngineContext);
    const parentContext: number = useContext((global as GlobalContext).ParentContext);
    const [position, setPosition] = useState<Vector3>(Vector3.Zero);
    const [rotation, setRotation] = useState<Vector3>(Vector3.Zero);
    const [scale, setScale] = useState<Vector3>(Vector3.One);
    const [startScale, setStartScale] = useState<Vector3>(Vector3.One);
    const meshRef = useRef<Mesh>();
    const getAllMeshes = useCallback(() => {
        if (mesh) {
            const meshes: Mesh[] = mesh.getChildMeshes(true);
            if (meshes.length === 0) {
                meshes.push(mesh);
            }
            return meshes;
        }
    }, [mesh]);
    const isUsingMaterial = useCallback(
        mxMaterialOption ||
            mxMaterialColor ||
            mxMaterialTexture ||
            mxLightingType ||
            mxRoughness ||
            mxMetalness ||
            mxMetalness,
        [mxMaterialOption, mxMaterialColor, mxMaterialTexture, mxLightingType, mxRoughness, mxMetalness, mxMetalness]
    );

    useEffect(() => {
        if (engineContext.scene) {
            OnSceneLoaded(engineContext.scene);
        }
    }, [engineContext.scene]);

    useEffect(() => {
        if (mesh && !meshRef.current) meshRef.current = mesh;
        if (mesh && !isNaN(parentContext)) {
            const localParentMesh = engineContext.scene?.getMeshByUniqueId(parentContext);
            if (localParentMesh) {
                mesh.setParent(localParentMesh);
            }
        }
    }, [mesh, parentContext, engineContext.scene]);

    useEffect(() => {
        return () => {
            meshRef.current?.dispose();
        };
    }, []);

    //#region Translation(position, rotation, scale)
    useEffect(() => {
        if (mesh && engineContext.scaleState === State.ACTIVE) {
            setStartScale(mesh.scaling.clone());
        }
    }, [engineContext.scaleState]);

    useEffect(() => {
        if (mesh) {
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;
        }
    }, [position, engineContext.xrActive, mesh]);

    useEffect(() => {
        if (mesh) {
            mesh.rotation.x = rotation.x * (Math.PI / 180);
            mesh.rotation.y = rotation.y * (Math.PI / 180);
            mesh.rotation.z = rotation.z * (Math.PI / 180);
        }
    }, [rotation, engineContext.xrActive, mesh]);

    useEffect(() => {
        if (mesh) {
            mesh.scaling.x = scale.x;
            mesh.scaling.y = scale.y;
            mesh.scaling.z = scale.z;
        }
    }, [scale, engineContext.xrActive, mesh]);

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
        if (mesh && engineContext.scene && isUsingMaterial) {
            let texture: Texture | undefined;
            let color: Color3 | undefined;
            mesh.visibility = Number(mxOpacity?.value);
            if (mxMaterialOption === "Color" && mxMaterialColor) {
                color = Color3.FromHexString(mxMaterialColor);
            }
            if (mxMaterialOption === "Texture" && mxMaterialTexture) {
                if (typeof mxMaterialTexture.value === "string") {
                    texture = new Texture(mxMaterialTexture.value, engineContext.scene!);
                } else if (typeof mxMaterialTexture.value === "number") {
                    texture = new Texture(Image.resolveAssetSource(mxMaterialTexture.value).uri, engineContext.scene);
                } else if (typeof mxMaterialTexture.value === "object") {
                    texture = new Texture(`file://${mxMaterialTexture.value.uri}`);
                }
            }
            const meshes = getAllMeshes();
            meshes?.forEach(childMesh => {
                if (mxLightingType === "PBR" && mxMaterialOption !== "Object") {
                    handlePBRMaterial(childMesh, color, texture);
                }
                if (mxLightingType === "Simple" && mxMaterialOption !== "Object") {
                    handleSimpleMaterial(childMesh, color, texture);
                }
            });
        }
    }, [mxMaterialColor, mxMaterialTexture, mesh, engineContext.scene]);

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
        getAllMeshes()?.forEach(childMesh => {
            if (mxOpacity?.value) {
                childMesh.visibility = Number(mxOpacity.value);
            }
        });
    }, [mxOpacity?.value, getAllMeshes]);

    useEffect(() => {
        getAllMeshes()?.forEach(childMesh => {
            if (mxRoughness?.value && childMesh && childMesh.material instanceof PBRMetallicRoughnessMaterial) {
                childMesh.material.roughness = Number(mxRoughness.value);
            }
        });
    }, [mxRoughness?.value, getAllMeshes]);

    useEffect(() => {
        getAllMeshes()?.forEach(childMesh => {
            if (mxMetalness?.value && childMesh && childMesh.material instanceof PBRMetallicRoughnessMaterial) {
                childMesh.material.metallic = Number(mxMetalness.value);
            }
        });
    }, [mxMetalness?.value, mesh]);
    //#endregion

    //#region Interaction
    useEffect(() => {
        //Handles dragging behaviour on mesh
        if (mesh && engineContext.scene && engineContext.xrActive) {
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
                            if (mesh) {
                                eventData.map(result => {
                                    mesh!.position = result.position;
                                });
                            }
                        });
                    }
                } else if (mxDragType === "FixedDistance") {
                    mesh.setParent(engineContext.scene.activeCamera);
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
                        mesh.setParent(parentMesh);
                    }
                }
            }
        }
    }, [mesh, engineContext.scene, mxDraggingEnabled, engineContext.featuresManager, engineContext.xrActive]);

    useEffect(() => {
        if (mesh?.scaling && mxUsePinchInteraction && mxPinchToScaleEnabled && mxPinchEnabled) {
            mesh.scaling.x = startScale.x * engineContext.pinchScale;
            mesh.scaling.y = startScale.y * engineContext.pinchScale;
            mesh.scaling.z = startScale.z * engineContext.pinchScale;
        }
        if (mxPinchEnabled && mxUsePinchInteraction && mxOnPinchActionValue?.canExecute) {
            mxOnPinchActionValue.execute();
        }
    }, [engineContext.pinchScale]);

    useEffect(() => {
        const foundMesh = getAllMeshes()?.find(someMesh => engineContext.pickedIDClicked.includes(someMesh.uniqueId));
        if (foundMesh) {
            engineContext.setPickedIDClicked(pickedIDs => pickedIDs.filter(id => id !== foundMesh.uniqueId));
            if (mxOnClick?.canExecute) {
                mxOnClick.execute();
            }
        }
    }, [engineContext.pickedIDClicked]);

    useEffect(() => {
        const foundMesh = getAllMeshes()?.find(someMesh => engineContext.hoveringMeshID === someMesh.uniqueId);
        if (foundMesh && mxOnHoverEnter?.canExecute) {
            mxOnHoverEnter.execute();
        }
        if (!foundMesh || isNaN(engineContext.hoveringMeshID)) {
            if (mxOnHoverExit?.canExecute) {
                mxOnHoverExit.execute();
            }
        }
    }, [engineContext.hoveringMeshID]);
    //#endregion

    return <Fragment />;
}
