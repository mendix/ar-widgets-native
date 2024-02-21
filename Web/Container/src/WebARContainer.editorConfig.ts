import { WebARContainerContainerProps } from "../typings/WebARContainerProps";
import { hidePropertyIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";

export function getProperties(values: WebARContainerContainerProps, defaultProperties: Properties): Properties {
    if (!values.mxUsePBR) {
        hidePropertyIn(defaultProperties, values, "mxHdrPath");
    }
    return defaultProperties;
}

export function check(values: WebARContainerContainerProps): Problem[] {
    const errors: Problem[] = [];
    if (values.mxUsePBR) {
        if (values.mxHdrPath?.toString() === "") {
            errors.push({
                property: "mxHdrPath",
                message: "Please add an hdr image for reflections on PBR objects."
            });
        }
    }
    return errors;
}
