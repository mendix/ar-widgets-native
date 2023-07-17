/**
 * This file was generated from WebARImageTracker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface WebARImageTrackerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    ScannedResult: EditableValue<string>;
    X: EditableValue<Big>;
    Y: EditableValue<Big>;
    Z: EditableValue<Big>;
    mxOnDataChanged?: ActionValue;
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
    ScannedResult: string;
    X: string;
    Y: string;
    Z: string;
    mxOnDataChanged: {} | null;
}
