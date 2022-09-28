import { Properties, Problem } from "../../ComponentParent/typings/PageEditor";
import { MxBaseProps } from "../../ComponentParent/typings/MxBaseProps";
import { getPropertiesBase, checkBase } from "../../ComponentParent//utils/3DObject.editorConfig";

export function getProperties(values: MxBaseProps, defaultProperties: Properties): Properties {
    return getPropertiesBase(values, defaultProperties);
}
export function check(values: MxBaseProps): Problem[] {
    return checkBase(values);
}
