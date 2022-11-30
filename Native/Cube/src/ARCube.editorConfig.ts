import { MxBaseProps } from "../../../Shared/ComponentParent/typings/MxBaseProps";
import { getPropertiesBase, checkBase } from "../../../Shared/ComponentParent//utils/3DObject.editorConfig";
import { hidePropertyIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";

export function getProperties(values: MxBaseProps, defaultProperties: Properties): Properties {
    return getPropertiesBase(values, defaultProperties);
}
export function check(values: MxBaseProps): Problem[] {
    return checkBase(values);
}
