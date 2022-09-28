/**
 * This file was generated from ARContainer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { DynamicValue } from "mendix";
import { Big } from "big.js";

export interface ARContainerProps<Style> {
    name: string;
    style: Style[];
    mxContentWidget: ReactNode;
    mxUsePreview: boolean;
    mxPreviewCameraDistance: Big;
    mxUsePBR: boolean;
    mxHdrPath?: DynamicValue<string>;
}

export interface ARContainerPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    mxContentWidget: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    mxUsePreview: boolean;
    mxPreviewCameraDistance: number | null;
    mxUsePBR: boolean;
    mxHdrPath: string;
}
