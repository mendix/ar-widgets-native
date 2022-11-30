/**
 * This file was generated from WebARNode.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type MxBillboardEnum = "none" | "billboard" | "billboardX" | "billboardY";

export type MxPositionTypeEnum = "Static" | "Attribute" | "Expression";

export type MxRotationTypeEnum = "Static" | "Attribute" | "Expression";

export type MxScaleTypeEnum = "Static" | "Attribute" | "Expression";

export type MxDragTypeEnum = "FixedDistance" | "FixedToWorld";

export interface WebARNodeContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    mxContentWidget?: ReactNode;
    mxBillboard: MxBillboardEnum;
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
    mxUseDraggingInteraction: boolean;
    mxDraggingEnabled: DynamicValue<boolean>;
    mxDragType: MxDragTypeEnum;
    mxOnDrag?: ActionValue;
    mxUsePinchInteraction: boolean;
    mxPinchEnabled: DynamicValue<boolean>;
    mxPinchToScaleEnabled: boolean;
    mxOnPinchActionValue?: ActionValue;
    mxOnClick?: ActionValue;
    mxOnHoverEnter?: ActionValue;
    mxOnHoverExit?: ActionValue;
}

export interface WebARNodePreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    mxContentWidget: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    mxBillboard: MxBillboardEnum;
    mxPositionType: MxPositionTypeEnum;
    mxPositionXStat: number | null;
    mxPositionYStat: number | null;
    mxPositionZStat: number | null;
    mxPositionXAtt: string;
    mxPositionYAtt: string;
    mxPositionZAtt: string;
    mxPositionXExpr: string;
    mxPositionYExpr: string;
    mxPositionZExpr: string;
    mxRotationType: MxRotationTypeEnum;
    mxRotationXStat: number | null;
    mxRotationYStat: number | null;
    mxRotationZStat: number | null;
    mxRotationXAtt: string;
    mxRotationYAtt: string;
    mxRotationZAtt: string;
    mxRotationXExpr: string;
    mxRotationYExpr: string;
    mxRotationZExpr: string;
    mxScaleType: MxScaleTypeEnum;
    mxScaleXStat: number | null;
    mxScaleYStat: number | null;
    mxScaleZStat: number | null;
    mxScaleXAtt: string;
    mxScaleYAtt: string;
    mxScaleZAtt: string;
    mxScaleXExpr: string;
    mxScaleYExpr: string;
    mxScaleZExpr: string;
    mxUseDraggingInteraction: boolean;
    mxDraggingEnabled: string;
    mxDragType: MxDragTypeEnum;
    mxOnDrag: {} | null;
    mxUsePinchInteraction: boolean;
    mxPinchEnabled: string;
    mxPinchToScaleEnabled: boolean;
    mxOnPinchActionValue: {} | null;
    mxOnClick: {} | null;
    mxOnHoverEnter: {} | null;
    mxOnHoverExit: {} | null;
}
