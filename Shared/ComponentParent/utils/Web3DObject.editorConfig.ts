import { hidePropertiesIn, Problem, Properties, PropertyGroup } from "@mendix/pluggable-widgets-tools";
import { MxBaseProps } from "../typings/MxBaseProps";
import { MxWebBaseProps } from "../typings/MxWebBaseProps";
import { getPropertiesBase as Base, checkBase as Check } from "./3DObject.editorConfig";

export function getPropertiesBase(values: MxWebBaseProps, defaultProperties: PropertyGroup[]): Properties {
    defaultProperties = Base(values as unknown as MxBaseProps, defaultProperties);

    if (!values.mxUseDraggingInteraction) {
        hidePropertiesIn(defaultProperties, values, [
            "mxScalingEnabled",
            "mxRotationEnabled",
            "mxOnScale",
            "mxGizmoColor",
            "mxGizmoSize"
        ]);
    }
    return defaultProperties;
}

export function checkBase(values: MxWebBaseProps): Problem[] {
    const errors = Check(values as unknown as MxBaseProps);

    return errors;
}
