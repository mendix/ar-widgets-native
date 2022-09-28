import { ActionValue, DynamicValue, NativeImage, EditableValue } from "mendix";
import { Style } from "util";

export type MxMaterialOptionEnum = "Texture" | "Color" | "Object";
export const enum DraggingTypeEnum {
    FixedDistance = "FixedDistance",
    FixedToWorld = "FixedToWorld"
}

export const enum PosRotScaleTypeEnum {
    Attribute = "Attribute",
    Expression = "Expression",
    Static = "Static"
}

export type LightType = "Simple" | "PBR";

export type AlignmentEnum = "Horizontal" | "Vertical";

export type BigValue = EditableValue<BigJs.Big> | DynamicValue<BigJs.Big>;

export interface MxBaseProps {
    name: string;
    style: Style[];
    mxPositionType: PosRotScaleTypeEnum;
    mxPositionXStat: number | null;
    mxPositionYStat: number | null;
    mxPositionZStat: number | null;
    mxPositionXAtt: EditableValue<BigJs.Big>;
    mxPositionYAtt: EditableValue<BigJs.Big>;
    mxPositionZAtt: EditableValue<BigJs.Big>;
    mxPositionXExpr: DynamicValue<BigJs.Big>;
    mxPositionYExpr: DynamicValue<BigJs.Big>;
    mxPositionZExpr: DynamicValue<BigJs.Big>;
    mxRotationType: PosRotScaleTypeEnum;
    mxRotationXStat: number | null;
    mxRotationYStat: number | null;
    mxRotationZStat: number | null;
    mxRotationXAtt: EditableValue<BigJs.Big>;
    mxRotationYAtt: EditableValue<BigJs.Big>;
    mxRotationZAtt: EditableValue<BigJs.Big>;
    mxRotationXExpr: DynamicValue<BigJs.Big>;
    mxRotationYExpr: DynamicValue<BigJs.Big>;
    mxRotationZExpr: DynamicValue<BigJs.Big>;
    mxScaleType: PosRotScaleTypeEnum;
    mxScaleXStat: number | null;
    mxScaleYStat: number | null;
    mxScaleZStat: number | null;
    mxScaleXAtt: EditableValue<BigJs.Big>;
    mxScaleYAtt: EditableValue<BigJs.Big>;
    mxScaleZAtt: EditableValue<BigJs.Big>;
    mxScaleXExpr: DynamicValue<BigJs.Big>;
    mxScaleYExpr: DynamicValue<BigJs.Big>;
    mxScaleZExpr: DynamicValue<BigJs.Big>;
    mxMaterialCustomEnabled?: boolean;
    mxMaterialOption: MaterialOptionEnum;
    mxMaterialTexture?: DynamicValue<NativeImage>;
    mxMaterialColor: string;
    mxLightingType: LightType;
    mxOpacity: DynamicValue<BigJs.Big>;
    mxRoughness: DynamicValue<BigJs.Big>;
    mxMetalness: DynamicValue<BigJs.Big>;
    mxUseDraggingInteraction: boolean;
    mxDraggingEnabled: boolean;
    mxDragType: DraggingType;
    mxUsePinchInteraction: boolean;
    mxPinchEnabled: boolean;
    mxPinchToScaleEnabled: boolean;
    mxOnClick?: ActionValue;
    mxOnDrag?: ActionValue;
    mxOnPinchActionValue?: ActionValue;
    mxOnCollision?: ActionValue;
    mxOnHover?: ActionValue;
}
