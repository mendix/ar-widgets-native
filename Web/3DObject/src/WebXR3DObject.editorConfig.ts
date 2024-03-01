import { hidePropertiesIn, Problem, Properties } from "@mendix/pluggable-widgets-tools";
import { MxWebBaseProps } from "../../../Shared/ComponentParent/typings/MxWebBaseProps";
import { getPropertiesBase, checkBase } from "../../../Shared/ComponentParent/utils/Web3DObject.editorConfig";
import { WebXR3DObjectContainerProps } from "../typings/WebXR3DObjectProps";

export function getProperties(values: MxWebBaseProps, defaultProperties: Properties): Properties {
    const base = getPropertiesBase(values, defaultProperties);
    if (values.mxMaterialOption === "Object") {
        hidePropertiesIn(base, base.values as unknown as WebXR3DObjectContainerProps, [
            "mxMaterialTexture",
            "mxMaterialAmbientOcclusion",
            "mxMaterialColor"
        ]);
    } else if (values.mxMaterialOption === "Texture") {
        hidePropertiesIn(base, base.values as unknown as WebXR3DObjectContainerProps, ["mxMaterialColor"]);
    } else if (values.mxMaterialOption === "Color") {
        hidePropertiesIn(base, base.values as unknown as WebXR3DObjectContainerProps, ["mxMaterialTexture"]);
    }

    return base;
}
export function check(): Problem[] {
    const errors: Problem[] = [];
    return errors;
}
