import React, { createElement, Context, useState, useEffect } from "react";
import { ActionManager, ExecuteCodeAction, Mesh, Scene } from "@babylonjs/core";
import { WebARNodeContainerProps } from "../typings/WebARNodeProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { GizmoComponent } from "../../../Shared/ComponentParent/src/GizmoComponent";
import { GlobalContext } from "../../../Shared/ComponentParent/typings/GlobalContextProps";
import { ValueStatus } from "mendix";
import Big from "big.js";

export function WebARNode(props: WebARNodeContainerProps): React.ReactElement | void {
    const global = globalThis;
    const ParentContext: Context<number> = (global as GlobalContext).ParentContext;
    const [nodeParent, setNodeParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [childrenActions, setChildrenActions] = useState<boolean>(false);

    const handleSceneLoaded = (scene: Scene) => {
        const localNode = new Mesh(props.name, scene);
        switch (props.mxBillboard) {
            case "billboard":
                localNode.billboardMode = Mesh.BILLBOARDMODE_ALL;
                break;
            case "billboardX":
                localNode.billboardMode = Mesh.BILLBOARDMODE_X;
                break;
            case "billboardY":
                localNode.billboardMode = Mesh.BILLBOARDMODE_Y;
                break;
            default:
                break;
        }

        setNodeParent(localNode);
        setParentID(localNode.uniqueId);
    };

    useEffect(() => {
        if (nodeParent !== undefined && childrenActions === false) {
            const children = nodeParent.getChildMeshes();
            children.forEach(child => {
                if (child.actionManager === null) {
                    child.actionManager = new ActionManager();
                }
                console.log("set child action");
                child.actionManager.registerAction(
                    new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
                        if (props.mxOnClick?.canExecute) {
                            props.mxOnClick.execute();
                        }
                    })
                );
            });
            setChildrenActions(true);
        }
    }, [nodeParent]);

    useEffect(() => {
        console.log(nodeParent?.getBoundingInfo());
    }, [nodeParent]);

    return (
        <>
            <GizmoComponent
                mesh={nodeParent}
                draggingEnabled={
                    props.mxDraggingEnabled.status === ValueStatus.Available ? props.mxDraggingEnabled.value : false
                }
                onScale={newScale => {
                    if (props.mxScaleType === "Attribute") {
                        props.mxScaleXAtt?.setValue(new Big(newScale.x));
                        props.mxScaleYAtt?.setValue(new Big(newScale.y));
                        props.mxScaleZAtt?.setValue(new Big(newScale.z));
                    }
                }}
            />
            <MeshComponent
                rootMesh={nodeParent}
                allMeshes={nodeParent ? [nodeParent] : undefined}
                mxPositionType={props.mxPositionType}
                mxPositionXStat={props.mxPositionXStat}
                mxPositionYStat={props.mxPositionYStat}
                mxPositionZStat={props.mxPositionZStat}
                mxPositionYAtt={props.mxPositionYAtt}
                mxPositionXAtt={props.mxPositionXAtt}
                mxPositionZAtt={props.mxPositionZAtt}
                mxPositionXExpr={props.mxPositionXExpr}
                mxPositionYExpr={props.mxPositionYExpr}
                mxPositionZExpr={props.mxPositionZExpr}
                mxRotationType={props.mxRotationType}
                mxRotationXStat={props.mxRotationXStat}
                mxRotationYStat={props.mxRotationYStat}
                mxRotationZStat={props.mxRotationZStat}
                mxRotationXAtt={props.mxRotationXAtt}
                mxRotationYAtt={props.mxRotationYAtt}
                mxRotationZAtt={props.mxRotationZAtt}
                mxRotationXExpr={props.mxRotationXExpr}
                mxRotationYExpr={props.mxRotationYExpr}
                mxRotationZExpr={props.mxRotationZExpr}
                mxScaleType={props.mxScaleType}
                mxScaleXStat={props.mxScaleXStat}
                mxScaleYStat={props.mxScaleYStat}
                mxScaleZStat={props.mxScaleZStat}
                mxScaleXAtt={props.mxScaleXAtt}
                mxScaleYAtt={props.mxScaleYAtt}
                mxScaleZAtt={props.mxScaleZAtt}
                mxScaleXExpr={props.mxScaleXExpr}
                mxScaleYExpr={props.mxScaleYExpr}
                mxScaleZExpr={props.mxScaleZExpr}
                OnSceneLoaded={handleSceneLoaded}
                mxUseDraggingInteraction={props.mxUseDraggingInteraction}
                mxUsePinchInteraction={props.mxUsePinchInteraction}
                mxDraggingEnabled={props.mxDraggingEnabled.value ?? false}
                mxDragType={props.mxDragType}
                mxOnDrag={props.mxOnDrag}
                mxPinchEnabled={props.mxPinchEnabled.value ?? false}
                mxPinchToScaleEnabled={props.mxPinchToScaleEnabled}
                mxOnPinchActionValue={props.mxOnPinchActionValue}
                mxOnHoverEnter={props.mxOnHoverEnter}
                mxOnHoverExit={props.mxOnHoverExit}
                mxOnClick={props.mxOnClick}
            />
            <ParentContext.Provider value={parentID}>{props.mxContentWidget}</ParentContext.Provider>
        </>
    );
}
