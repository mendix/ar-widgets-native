/**
 * This file was generated from WebARContainer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue } from "mendix";
import { Big } from "big.js";

export interface WebARContainerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    mxContentWidget?: ReactNode;
    mxPreviewCameraDistance: Big;
    mxPositionX: Big;
    mxPositionY: Big;
    mxPositionZ: Big;
    mxBackgroundColor: DynamicValue<string>;
    mxUsePBR: boolean;
    mxHdrPath?: DynamicValue<string>;
}

export interface WebARContainerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    mxContentWidget: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    mxPreviewCameraDistance: number | null;
    mxPositionX: number | null;
    mxPositionY: number | null;
    mxPositionZ: number | null;
    mxBackgroundColor: string;
    mxUsePBR: boolean;
    mxHdrPath: string;
}
