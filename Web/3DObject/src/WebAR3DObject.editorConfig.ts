import { hidePropertiesIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";
import { MxWebBaseProps } from "../../../Shared/ComponentParent/typings/MxWebBaseProps";
import { getPropertiesBase, checkBase } from "../../../Shared/ComponentParent/utils/Web3DObject.editorConfig";
import { WebAR3DObjectContainerProps } from "../typings/WebAR3DObjectProps";

export function getProperties(values: MxWebBaseProps, defaultProperties: Properties): Properties {
    const base = getPropertiesBase(values, defaultProperties);
    if (values.mxMaterialOption === "Object") {
        hidePropertiesIn(base, base.values as unknown as WebAR3DObjectContainerProps, [
            "mxMaterialTexture",
            "mxMaterialAmbientOcclusion",
            "mxMaterialColor"
        ]);
    } else if (values.mxMaterialOption === "Texture") {
        hidePropertiesIn(base, base.values as unknown as WebAR3DObjectContainerProps, ["mxMaterialColor"]);
    } else if (values.mxMaterialOption === "Color") {
        hidePropertiesIn(base, base.values as unknown as WebAR3DObjectContainerProps, ["mxMaterialTexture"]);
    }

    return base;
}
export function check(): Problem[] {
    const errors: Problem[] = [];
    return errors;
}
