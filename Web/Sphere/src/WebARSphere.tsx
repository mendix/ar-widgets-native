import React, { createElement, useEffect, useState } from "react";
import { WebARSphereContainerProps } from "../typings/WebARSphereProps";
import { MeshComponent } from "../../../Shared/ComponentParent/src/MeshComponent";
import { Mesh, MeshBuilder, Scene, Texture, Vector3 } from "@babylonjs/core";

export function WebARSphere(
  props: WebARSphereContainerProps
): React.ReactElement | void {
  const { mxMaterialTexture } = props;
  const [mesh, setMesh] = useState<Mesh>();
  const [scene, setScene] = useState<Scene>();
  const handleSceneLoaded = (scene: Scene) => {
    const sphere = MeshBuilder.CreateSphere(props.name, { diameter: 0 }, scene);
    sphere.scaling = Vector3.Zero();
    setMesh(sphere);
    setScene(scene);
  };
  const [texture, setTexture] = useState<Texture>();

  useEffect(() => {
    if (mxMaterialTexture && scene) {
      if (typeof mxMaterialTexture.value === "string") {
        setTexture(new Texture(mxMaterialTexture.value, scene));
      } else if (typeof mxMaterialTexture.value === "object") {
        setTexture(new Texture(mxMaterialTexture.value.uri, scene));
      }
    }
  }, [mxMaterialTexture, scene]);

  return (
    <MeshComponent
      rootMesh={mesh}
      allMeshes={mesh ? [mesh] : undefined}
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
      mxMaterialColor={props.mxMaterialColor.value ?? "#0CABF9"}
      mxMaterialOption={props.mxMaterialOption}
      texture={texture}
      mxMetalness={props.mxMetalness}
      mxOpacity={props.mxOpacity}
      mxRoughness={props.mxRoughness}
      mxLightingType={props.mxLightingType}
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
  );
}
