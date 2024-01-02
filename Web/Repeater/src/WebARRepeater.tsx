import { createElement, ReactElement } from "react";
import { WebARRepeaterContainerProps } from "../typings/WebARRepeaterProps";
import { ARSharedRepeater } from "../../../Shared/ComponentParent/src/SharedRepeater";

export function WebARRepeater(
  props: WebARRepeaterContainerProps
): ReactElement {
  return (
    <ARSharedRepeater datasource={props.datasource} content={props.content} />
  );
}
