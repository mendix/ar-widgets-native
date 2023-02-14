import React, { Fragment, useEffect, useRef, useState } from "react";
import { BoundingBoxGizmo, Color3, Mesh, PointerDragBehavior, Tools, Vector3 } from "@babylonjs/core";

export type Gizmo = {
    mesh?: Mesh;
    draggingEnabled: boolean;
    pinchEnabled: boolean;
    rotationEnabled: boolean;
    gizmoSize: number;
    onScale: (newScale: Vector3) => void;
    onDrag: (newPosition: Vector3) => void;
    onRotate: (newRotation: Vector3) => void;
    color: string;
};

export function useGizmoComponent(gizmoProps: Gizmo) {
    const { mesh, draggingEnabled, pinchEnabled, rotationEnabled, gizmoSize, onScale, onDrag, onRotate, color } =
        gizmoProps;
    const [gizmo, setGizmo] = useState<BoundingBoxGizmo>();
    const [dragBehaviour, setDragBehaviour] = useState<PointerDragBehavior>();
    const meshRef = useRef<Mesh>();

    useEffect(() => {
        if (draggingEnabled && mesh && gizmo === undefined) {
            setGizmo(createGizmo(mesh));
            if (dragBehaviour === undefined) {
                setDragBehaviour(createDragBehaviour(mesh));
            } else {
                dragBehaviour.enabled = true;
            }
            meshRef.current = mesh;
        }
        if (gizmo !== undefined && !draggingEnabled) {
            if (dragBehaviour) dragBehaviour.enabled = false;
            refreshGizmo();
        }
    }, [draggingEnabled, mesh]);

    useEffect(() => {
        if (gizmo) {
            setUpGizmoCallbacks(gizmo);
            setGizmoVariables(gizmo, Color3.FromHexString(color), pinchEnabled, gizmoSize, draggingEnabled);

            return () => {
                gizmo.dispose();
            };
        }
    }, [gizmo]);

    useEffect(() => {
        if (gizmo !== undefined) {
            setGizmoVariables(gizmo, Color3.FromHexString(color), pinchEnabled, gizmoSize, rotationEnabled);
        }
    }, [pinchEnabled, rotationEnabled, gizmoSize, color]);

    const setGizmoVariables = (
        newGizmo: BoundingBoxGizmo,
        gizmoColor: Color3,
        gizmoPinchEnabled: boolean,
        gizmoSize: number,
        gizmoRotationEnabled: boolean
    ) => {
        newGizmo.setColor(gizmoColor);
        newGizmo.setEnabledScaling(gizmoPinchEnabled);
        newGizmo.scaleBoxSize = gizmoSize;
        newGizmo.rotationSphereSize = gizmoRotationEnabled ? gizmoSize : 0;
    };

    const setUpGizmoCallbacks = (newGizmo: BoundingBoxGizmo) => {
        newGizmo.onScaleBoxDragEndObservable.add(() => {
            onScale(mesh!.scaling.clone());
            newGizmo.updateBoundingBox();
        });
        newGizmo.onRotationSphereDragEndObservable.add(() => {
            if (meshRef.current?.rotationQuaternion) {
                const euler = meshRef.current.rotationQuaternion?.toEulerAngles();
                onRotate(new Vector3(Tools.ToDegrees(euler.x), Tools.ToDegrees(euler.y), Tools.ToDegrees(euler.z)));
            }
        });
    };

    const createGizmo = (mesh: Mesh): BoundingBoxGizmo => {
        const returnGizmo = new BoundingBoxGizmo();
        returnGizmo.attachedMesh = mesh;
        return returnGizmo;
    };

    const createDragBehaviour = (mesh: Mesh): PointerDragBehavior => {
        const returnDragBehaviour = new PointerDragBehavior();
        returnDragBehaviour.attach(mesh);
        returnDragBehaviour.onDragEndObservable.add(() => {
            onDrag(mesh!.position.clone());
        });
        return returnDragBehaviour;
    };

    const refreshGizmo = () => {
        if (gizmo !== undefined) {
            gizmo.dispose();
            setGizmo(undefined);
        }
    };
}
