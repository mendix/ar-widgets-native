import React, { useEffect, useState } from "react";
import { BoundingBoxGizmo, Color3, Mesh, PointerDragBehavior, Vector3 } from "@babylonjs/core";

export type Gizmo = {
    mesh?: Mesh;
    draggingEnabled: boolean;
    pinchEnabled: boolean;
    rotationEnabled: boolean;
    gizmoSize: number;
    color: string;
};

type GizmoReturn = {
    newScale?: Vector3;
    newPosition?: Vector3;
    newRotation?: Vector3;
};

export function useGizmoComponent(gizmoProps: Gizmo): GizmoReturn {
    const { mesh, draggingEnabled, pinchEnabled, rotationEnabled, gizmoSize, color } = gizmoProps;
    const [gizmo, setGizmo] = useState<BoundingBoxGizmo>();
    const [dragBehaviour, setDragBehaviour] = useState<PointerDragBehavior>();
    const [returnScale, setReturnScale] = useState<Vector3>();
    const [returnRotation, setReturnRotation] = useState<Vector3>();
    const [returnPosition, setReturnPosition] = useState<Vector3>();

    useEffect(() => {
        if (gizmo) {
            if (!draggingEnabled) {
                if (dragBehaviour) dragBehaviour.enabled = false;
                gizmo.dispose();
                setGizmo(undefined);
            } else {
                gizmo.updateBoundingBox();
            }
        } else if (draggingEnabled && mesh) {
            setGizmo(createGizmo(mesh));
            initReturnTransform(mesh);

            if (dragBehaviour === undefined) {
                setDragBehaviour(createDragBehaviour(mesh));
            } else {
                dragBehaviour.enabled = true;
            }
        }
    }, [draggingEnabled, mesh]);

    useEffect(() => {
        if (gizmo) {
            setUpGizmoCallbacks(gizmo);
            setGizmoVariables(Color3.FromHexString(color), pinchEnabled, gizmoSize, rotationEnabled);
            return () => {
                gizmo.dispose();
            };
        }
    }, [gizmo]);

    useEffect(() => {
        setGizmoVariables(Color3.FromHexString(color), pinchEnabled, gizmoSize, rotationEnabled);
    }, [pinchEnabled, rotationEnabled, gizmoSize, color]);

    const setGizmoVariables = (
        gizmoColor: Color3,
        gizmoPinchEnabled: boolean,
        gizmoSize: number,
        gizmoRotationEnabled: boolean
    ) => {
        if (gizmo) {
            gizmo.setColor(gizmoColor);
            gizmo.setEnabledScaling(gizmoPinchEnabled);
            gizmo.scaleBoxSize = Math.abs(gizmoSize);
            gizmo.rotationSphereSize = gizmoRotationEnabled ? Math.abs(gizmoSize) : 0;
            gizmo.updateBoundingBox();
        }
    };

    const setUpGizmoCallbacks = (newGizmo: BoundingBoxGizmo) => {
        newGizmo.onScaleBoxDragEndObservable.add(() => {
            setReturnScale(mesh!.scaling.clone());
            setReturnPosition(mesh!.position.clone());
        });
        newGizmo.onRotationSphereDragEndObservable.add(() => {
            const rotationQuat = mesh!.rotationQuaternion?.toEulerAngles();
            if (rotationQuat) {
                setReturnRotation(
                    new Vector3(
                        (rotationQuat.x * 180) / Math.PI,
                        (rotationQuat.y * 180) / Math.PI,
                        (rotationQuat.z * 180) / Math.PI
                    )
                );
            }
        });
    };

    const createGizmo = (mesh: Mesh): BoundingBoxGizmo => {
        const newGizmo = new BoundingBoxGizmo();
        newGizmo.rotationSphereSize = rotationEnabled ? gizmoSize : 0;
        newGizmo.attachedMesh = mesh;
        newGizmo.updateBoundingBox();
        return newGizmo;
    };

    const initReturnTransform = (mesh: Mesh) => {
        setReturnScale(mesh.scaling);
        setReturnPosition(mesh.position);
        if (mesh.rotationQuaternion) {
            const rotationQuat = mesh.rotationQuaternion.toEulerAngles();
            setReturnRotation(
                new Vector3(
                    (rotationQuat.x * 180) / Math.PI,
                    (rotationQuat.y * 180) / Math.PI,
                    (rotationQuat.z * 180) / Math.PI
                )
            );
        }
    };

    const createDragBehaviour = (mesh: Mesh): PointerDragBehavior => {
        const newDragBehaviour = new PointerDragBehavior();
        newDragBehaviour.attach(mesh);
        newDragBehaviour.onDragEndObservable.add(() => {
            setReturnPosition(mesh!.position.clone());
        });
        return newDragBehaviour;
    };

    return {
        newPosition: returnPosition,
        newRotation: returnRotation,
        newScale: returnScale
    };
}
