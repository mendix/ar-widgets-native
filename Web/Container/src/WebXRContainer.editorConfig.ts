import { WebXRContainerContainerProps } from "../typings/WebXRContainerProps";
import { hidePropertyIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";

export function getProperties(values: WebXRContainerContainerProps, defaultProperties: Properties): Properties {
    if (!values.mxUsePBR) {
        hidePropertyIn(defaultProperties, values, "mxHdrPath");
    }
    return defaultProperties;
}

export function check(values: WebXRContainerContainerProps): Problem[] {
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
