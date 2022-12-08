/**
 * This file was generated from WebARRepeater.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties } from "react";
import { ListValue, ListWidgetValue } from "mendix";

export interface WebARRepeaterContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    datasource: ListValue;
    content: ListWidgetValue;
}

export interface WebARRepeaterPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    datasource: {} | { type: string } | null;
    content: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
}
