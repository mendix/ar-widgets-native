/**
 * This file was generated from WebARImageTracker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue } from "mendix";

export interface WebARImageTrackerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    mxContentWidget?: ReactNode;
    mxOnClick?: ActionValue;
    mxOnHoverEnter?: ActionValue;
    mxOnHoverExit?: ActionValue;
}

export interface WebARImageTrackerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    mxContentWidget: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    mxOnClick: {} | null;
    mxOnHoverEnter: {} | null;
    mxOnHoverExit: {} | null;
}
