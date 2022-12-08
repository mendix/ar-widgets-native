import { createElement, ReactElement, Fragment } from "react";
import { ValueStatus, ListValue, ListWidgetValue } from "mendix";

export function ARSharedRepeater(props: { datasource: ListValue; content: ListWidgetValue }): ReactElement {
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
