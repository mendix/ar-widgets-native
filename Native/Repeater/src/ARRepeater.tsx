import { createElement, ReactElement } from "react";
import { ARRepeaterProps } from "../typings/ARRepeaterProps";
import { Style } from "@mendix/pluggable-widgets-tools";
import { ARSharedRepeater } from "../../../Shared/ComponentParent/src/SharedRepeater";

export function ARRepeater(props: ARRepeaterProps<Style>): ReactElement {
  return (
    <ARSharedRepeater datasource={props.datasource} content={props.content} />
  );
}
