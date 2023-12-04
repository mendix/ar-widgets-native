import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, WebImage, NativeImage } from "mendix";
import { Big } from "big.js";
import { Texture } from "@babylonjs/core";

export type MxPositionTypeEnum = "Static" | "Attribute" | "Expression";

export type MxRotationTypeEnum = "Static" | "Attribute" | "Expression";

export type MxScaleTypeEnum = "Static" | "Attribute" | "Expression";

export type MxMaterialOptionEnum = "Texture" | "Color";

export type MxLightingTypeEnum = "Simple" | "PBR";

export type MxDragTypeEnum = "FixedDistance" | "FixedToWorld";

export interface ARTextProps {
    name: string;
    tabIndex?: number;
    mxText: DynamicValue<string>;
    mxPositionType: MxPositionTypeEnum;
    mxPositionXStat: Big;
    mxPositionYStat: Big;
    mxPositionZStat: Big;
    mxPositionXAtt?: EditableValue<Big>;
    mxPositionYAtt?: EditableValue<Big>;
    mxPositionZAtt?: EditableValue<Big>;
    mxPositionXExpr: DynamicValue<Big>;
    mxPositionYExpr: DynamicValue<Big>;
    mxPositionZExpr: DynamicValue<Big>;
    mxRotationType: MxRotationTypeEnum;
    mxRotationXStat: Big;
    mxRotationYStat: Big;
    mxRotationZStat: Big;
    mxRotationXAtt?: EditableValue<Big>;
    mxRotationYAtt?: EditableValue<Big>;
    mxRotationZAtt?: EditableValue<Big>;
    mxRotationXExpr: DynamicValue<Big>;
    mxRotationYExpr: DynamicValue<Big>;
    mxRotationZExpr: DynamicValue<Big>;
    mxScaleType: MxScaleTypeEnum;
    mxScaleXStat: Big;
    mxScaleYStat: Big;
    mxScaleZStat: Big;
    mxScaleXAtt?: EditableValue<Big>;
    mxScaleYAtt?: EditableValue<Big>;
    mxScaleZAtt?: EditableValue<Big>;
    mxScaleXExpr: DynamicValue<Big>;
    mxScaleYExpr: DynamicValue<Big>;
    mxScaleZExpr: DynamicValue<Big>;
    mxMaterialOption: MxMaterialOptionEnum;
    mxMaterialTexture?: DynamicValue<WebImage> | DynamicValue<NativeImage>;
    mxMaterialColor: DynamicValue<string>;
    mxOpacity: DynamicValue<Big>;
    mxLightingType: MxLightingTypeEnum;
    mxRoughness: DynamicValue<Big>;
    mxMetalness: DynamicValue<Big>;
    mxUseDraggingInteraction: boolean;
    mxDraggingEnabled: DynamicValue<boolean>;
    mxDragType: MxDragTypeEnum;
    mxOnDrag?: ActionValue;
    mxUsePinchInteraction: boolean;
    mxPinchEnabled: DynamicValue<boolean>;
    mxPinchRotationEnabled?: DynamicValue<boolean>;
    mxGizmoColor?: DynamicValue<string>;
    mxGizmoSize?: DynamicValue<Big>;
    mxOnPinchActionValue?: ActionValue;
    mxOnClick?: ActionValue;
    mxOnHoverEnter?: ActionValue;
    mxOnHoverExit?: ActionValue;
    compiledTexture?: Texture;
    handleSceneLoaded?: (scene: Scene) => void;
    useGizmo?: boolean;
}
