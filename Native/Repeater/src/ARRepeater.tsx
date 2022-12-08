import { createElement, ReactElement, Fragment } from "react";
import { ValueStatus } from "mendix";
import { ARRepeaterProps } from "../typings/ARRepeaterProps";
import { Style } from "@mendix/pluggable-widgets-tools";

export function ARRepeater(props: ARRepeaterProps<Style>): ReactElement {
  if (
    props.datasource.status === ValueStatus.Loading ||
    !props.datasource.items ||
    props.datasource.items.length === 0
  ) {
    return <Fragment />;
  }

  return (
    <Fragment>
      {props.datasource.items?.map((item, index) => (
        <Fragment key={`item_${index}`}>{props.content.get(item)}</Fragment>
      ))}
    </Fragment>
  );
}
