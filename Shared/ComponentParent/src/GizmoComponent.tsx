import React, { Fragment, useEffect, useRef, useState } from "react";
import {
    Action,
    ActionManager,
    BoundingBoxGizmo,
    Color3,
    ExecuteCodeAction,
    Mesh,
    PointerDragBehavior,
    Tools,
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
    const [dragBehaviour, setDragBehaviour] = useState<PointerDragBehavior>();
    const [action, setAction] = useState<Action>();
    const meshRef = useRef<Mesh>();

    useEffect(() => {
        setAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => props.onDrag(meshRef.current!.position)));
    }, []);

    useEffect(() => {
        if (props.mesh !== undefined) {
            if (gizmo === undefined && props.draggingEnabled === true) {
                const localGizmo = new BoundingBoxGizmo();
                meshRef.current = props.mesh;
                localGizmo.onScaleBoxDragEndObservable.add(() => {
                    props.onScale(props.mesh!.scaling.clone());
                    localGizmo.updateBoundingBox();
                });
                if (action !== undefined) props.mesh.actionManager?.registerAction(action);
                localGizmo.onRotationSphereDragEndObservable.add(() => {
                    if (meshRef.current?.rotationQuaternion) {
                        const euler = meshRef.current.rotationQuaternion?.toEulerAngles();
                        props.onRotate(
                            new Vector3(Tools.ToDegrees(euler.x), Tools.ToDegrees(euler.y), Tools.ToDegrees(euler.z))
                        );
                    }
                });
                localGizmo.setColor(Color3.FromHexString(props.color));
                localGizmo.setEnabledScaling(props.pinchEnabled);
                localGizmo.scaleBoxSize = props.gizmoSize;
                localGizmo.rotationSphereSize = props.rotationEnabled ? props.gizmoSize : 0;
                localGizmo.attachedMesh = props.mesh;

                if (dragBehaviour === undefined) {
                    const pointerDragBehaviour = new PointerDragBehavior();
                    pointerDragBehaviour.attach(props.mesh);
                    pointerDragBehaviour.onDragEndObservable.add(() => {
                        props.onDrag(props.mesh!.position.clone());
                    });
                    setDragBehaviour(pointerDragBehaviour);
                } else {
                    dragBehaviour.enabled = true;
                }
                setGizmo(localGizmo);
            }
            if (gizmo !== undefined && props.draggingEnabled === false) {
                if (dragBehaviour) dragBehaviour.enabled = false;
                refreshGizmo();
            }
        }
    }, [props.draggingEnabled, props.mesh, gizmo]);

    useEffect(() => {
        return () => {
            gizmo?.dispose();
        };
    }, [gizmo]);

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
            if (action !== undefined && props.mesh !== undefined) props.mesh.actionManager?.unregisterAction(action);
            setGizmo(undefined);
        }
    };

    return <Fragment />;
}
