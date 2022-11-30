/**
 * This file was generated from ARImageTracker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, NativeImage } from "mendix";
import { Big } from "big.js";

export type MxOrientationEnum = "Up" | "Down" | "Left" | "Right";

export interface ARImageTrackerProps<Style> {
    name: string;
    style: Style[];
    mxImage: DynamicValue<NativeImage>;
    mxOrientation: MxOrientationEnum;
    mxContent?: ReactNode;
    mxPhysicalMarkerSize: Big;
    mxOnAnchorFound?: ActionValue;
}

export interface ARImageTrackerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    mxImage: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    mxOrientation: MxOrientationEnum;
    mxContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    mxPhysicalMarkerSize: number | null;
    mxOnAnchorFound: {} | null;
}
