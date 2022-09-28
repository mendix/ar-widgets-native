import { Properties, Problem } from "../../ComponentParent/typings/PageEditor";
import { ARContainerProps } from "../typings/ARContainerProps";
import { hidePropertyIn } from "../../ComponentParent/utils/PageEditorUtils";
import { Style } from "util";

export function getProperties(values: ARContainerProps<Style>, defaultProperties: Properties): Properties {
    if (!values.mxUsePBR) {
        hidePropertyIn(defaultProperties, values, "mxHdrPath");
    }
    if (!values.mxUsePreview) {
        hidePropertyIn(defaultProperties, values, "mxPreviewCameraDistance");
    }
    return defaultProperties;
}

export function check(values: ARContainerProps<Style>): Problem[] {
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
