import { Problem, Properties } from "@mendix/pluggable-widgets-tools";
import { MxWebBaseProps } from "../../../Shared/ComponentParent/typings/MxWebBaseProps";
import { getPropertiesBase, checkBase } from "../../../Shared/ComponentParent/utils/Web3DObject.editorConfig";

export function getProperties(values: MxWebBaseProps, defaultProperties: Properties): Properties {
    return getPropertiesBase(values, defaultProperties);
}
export function check(values: MxWebBaseProps): Problem[] {
    return checkBase(values);
}
