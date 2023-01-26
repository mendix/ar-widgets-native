import React, { Fragment, useEffect, useRef, useState } from "react";
import { BoundingBoxGizmo, Color3, Mesh, Vector3 } from "@babylonjs/core";

export function GizmoComponent(props: {
    mesh?: Mesh;
    draggingEnabled: boolean;
    pinchEnabled: boolean;
    rotationEnabled: boolean;
    gizmoSize: number;
    onScale: (newScale: Vector3) => void;
    color: string;
}): React.ReactElement {
    const [gizmo, setGizmo] = useState<BoundingBoxGizmo>();
    const gizmoRef = useRef<BoundingBoxGizmo>();
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
                localGizmo.onScaleBoxDragObservable.add(() => {
                    props.onScale(props.mesh!.scaling.clone());
                });
                localGizmo.onScaleBoxDragEndObservable.add(() => {
                    localGizmo.updateBoundingBox();
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
            setGizmo(undefined);
        }
    };

    return <Fragment />;
}
