import React, { Fragment, useEffect, useRef, useState } from "react";
import {
    ActionManager,
    BoundingBoxGizmo,
    Color3,
    ExecuteCodeAction,
    Mesh,
    Nullable,
    Observer,
    Quaternion,
    Tools,
    TransformNode,
    Vector3
} from "@babylonjs/core";

export function GizmoComponent(props: {
    mesh?: Mesh;
    draggingEnabled: boolean;
    pinchEnabled: boolean;
    rotationEnabled: boolean;
    gizmoSize: number;
    onScale: (newScale: Vector3) => void;
    onDrag: (newPosition: Vector3) => void;
    onRotate: (newRotation: Vector3) => void;
    color: string;
}): React.ReactElement {
    const [gizmo, setGizmo] = useState<BoundingBoxGizmo>();
    const gizmoRef = useRef<BoundingBoxGizmo>();
    const callbackRef = useRef<Nullable<Observer<TransformNode>>>();
    const meshRef = useRef<Mesh>();

    useEffect(() => {
        return () => {
            gizmoRef.current?.dispose();
        };
    }, []);
    useEffect(() => {
        if (props.mesh !== undefined) {
            if (gizmo === undefined && props.draggingEnabled === true) {
                const localGizmo = new BoundingBoxGizmo();
                localGizmo.enableDragBehavior();
                meshRef.current = props.mesh;
                localGizmo.onScaleBoxDragEndObservable.add(() => {
                    props.onScale(props.mesh!.scaling.clone());
                    localGizmo.updateBoundingBox();
                });
                props.mesh.actionManager?.registerAction(
                    new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
                        console.log(props.mesh?.position);
                        if (props.mesh) props.onDrag(props.mesh.position);
                    })
                );
                localGizmo.onRotationSphereDragEndObservable.add(() => {
                    console.log(meshRef.current);
                    console.log(props.mesh?.rotationQuaternion);
                    if (meshRef.current?.rotationQuaternion) {
                        const euler = meshRef.current.rotationQuaternion?.toEulerAngles();
                        const angles = new Vector3(
                            Tools.ToDegrees(euler.x),
                            Tools.ToDegrees(euler.y),
                            Tools.ToDegrees(euler.z)
                        );
                        console.log("angles: " + angles);
                        props.onRotate(angles);
                    }
                });
                localGizmo.setColor(Color3.FromHexString(props.color));
                localGizmo.setEnabledScaling(props.pinchEnabled);
                localGizmo.scaleBoxSize = props.gizmoSize;
                localGizmo.rotationSphereSize = props.rotationEnabled ? props.gizmoSize : 0;
                localGizmo.attachedMesh = props.mesh;

                setGizmo(localGizmo);
                gizmoRef.current = localGizmo;
            }
            if (gizmo !== undefined && props.draggingEnabled === false) {
                refreshGizmo();
            }
        }
    }, [props.draggingEnabled, props.mesh, gizmo]);

    useEffect(() => {
        if (gizmo !== undefined) {
            gizmo.setColor(Color3.FromHexString(props.color));
        }
    }, [props.color, gizmo]);

    useEffect(() => {
        if (gizmo !== undefined) {
            gizmo.setEnabledScaling(props.pinchEnabled);
            gizmo.scaleBoxSize = props.gizmoSize;
            gizmo.rotationSphereSize = props.rotationEnabled ? props.gizmoSize : 0;
            gizmo.updateBoundingBox();
        }
    }, [props.pinchEnabled, props.rotationEnabled, props.gizmoSize, gizmo]);

    const refreshGizmo = () => {
        if (gizmo !== undefined) {
            gizmo.dispose();
            if (callbackRef.current) props.mesh?.onAfterWorldMatrixUpdateObservable.remove(callbackRef.current);
            setGizmo(undefined);
        }
    };

    return <Fragment />;
}
