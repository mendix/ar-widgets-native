import { createElement, ReactElement } from "react";
import { WebXRRepeaterContainerProps } from "../typings/WebXRRepeaterProps";
import { ARSharedRepeater } from "../../../Shared/ComponentParent/src/SharedRepeater";

export function WebXRRepeater(
  props: WebXRRepeaterContainerProps,
): ReactElement {
  return (
    <ARSharedRepeater datasource={props.datasource} content={props.content} />
  );
}
