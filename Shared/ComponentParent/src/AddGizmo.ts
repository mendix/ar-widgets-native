import { useEffect, useState } from "react";
import { BoundingBoxGizmo } from "@babylonjs/core";
import { MeshComponentProps } from "../typings/MeshComponentProps";
import Big from "big.js";

export function AddGizmo(InputComponent: React.ReactElement<MeshComponentProps>) {
    const [gizmo, setGizmo] = useState<BoundingBoxGizmo>();

    useEffect(() => {
        if (InputComponent.props.rootMesh !== undefined) {
            if (gizmo === undefined && InputComponent.props.mxDraggingEnabled === true) {
                const localGizmo = new BoundingBoxGizmo();
                localGizmo.enableDragBehavior();
                localGizmo.onScaleBoxDragObservable.add(() => {
                    InputComponent.props.mxScaleXAtt?.setValue(new Big(InputComponent.props.rootMesh.scaling.x));
                    InputComponent.props.mxScaleYAtt?.setValue(new Big(InputComponent.props.rootMesh.scaling.y));
                    InputComponent.props.mxScaleZAtt?.setValue(new Big(InputComponent.props.rootMesh.scaling.z));
                });
                localGizmo.rotationSphereSize = 0.05;
                localGizmo.scaleBoxSize = 0.05;
                localGizmo.attachedMesh = InputComponent.props.rootMesh;
                setGizmo(localGizmo);
            }
            if (gizmo !== undefined && InputComponent.props.mxDraggingEnabled === false) {
                gizmo.dispose();
                setGizmo(undefined);
            }
        }
    }, [InputComponent.props.mxDraggingEnabled, InputComponent.props.rootMesh, gizmo]);
}
