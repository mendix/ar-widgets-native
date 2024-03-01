/**
 * This file was generated from WebXRRepeater.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ListValue, ListWidgetValue } from "mendix";

export interface WebXRRepeaterContainerProps {
  name: string;
  class: string;
  style?: CSSProperties;
  tabIndex?: number;
  datasource: ListValue;
  content: ListWidgetValue;
}

export interface WebXRRepeaterPreviewProps {
  /**
   * @deprecated Deprecated since version 9.18.0. Please use class property instead.
   */
  className: string;
  class: string;
  style: string;
  styleObject?: CSSProperties;
  readOnly: boolean;
  datasource: {} | { caption: string } | { type: string } | null;
  content: {
    widgetCount: number;
    renderer: ComponentType<{ children: ReactNode; caption?: string }>;
  };
}
