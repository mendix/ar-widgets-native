/**
 * This file was generated from WebXRImageTracker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface WebXRImageTrackerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    mxScannedResult: EditableValue<string>;
    mxPositionX: EditableValue<Big>;
    mxPositionY: EditableValue<Big>;
    mxPositionZ: EditableValue<Big>;
    mxOnDataChanged?: ActionValue;
}

export interface WebXRImageTrackerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    mxScannedResult: string;
    mxPositionX: string;
    mxPositionY: string;
    mxPositionZ: string;
    mxOnDataChanged: {} | null;
}
