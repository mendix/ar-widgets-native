import { hidePropertiesIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";
import { MxBaseProps } from "../../../Shared/ComponentParent/typings/MxBaseProps";
import { getPropertiesBase, checkBase } from "../../../Shared/ComponentParent/utils/3DObject.editorConfig";

export function getProperties(values: MxBaseProps, defaultProperties: Properties): Properties {
    if (values.mxMaterialOption === "Object") {
        hidePropertiesIn(defaultProperties, values, [
            "mxMaterialColor",
            "mxMaterialTexture",
            "mxLightingType",
            "mxRoughness",
            "mxMetalness"
        ]);
    }
    return getPropertiesBase(values, defaultProperties);
}
export function check(values: MxBaseProps): Problem[] {
    return checkBase(values);
}
