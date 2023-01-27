import { hidePropertiesIn, hidePropertyIn, Problem, Properties, PropertyGroup } from "@mendix/pluggable-widgets-tools";
import { MxBaseProps, PosRotScaleTypeEnum } from "../typings/MxBaseProps";
import { MxWebBaseProps } from "../typings/MxWebBaseProps";
import { getPropertiesBase as Base, checkBase as Check } from "./3DObject.editorConfig";

export function getPropertiesBase(values: MxWebBaseProps, defaultProperties: PropertyGroup[]): Properties {
    defaultProperties = Base(values as unknown as MxBaseProps, defaultProperties);
    if (!values.mxUsePinchInteraction) {
        hidePropertiesIn(defaultProperties, values, ["mxPinchRotationEnabled", "mxGizmoColor", "mxGizmoSize"]);
    }
    return defaultProperties;
}

export function checkBase(values: MxWebBaseProps): Problem[] {
    const errors = Check(values as unknown as MxBaseProps);

    return errors;
}
