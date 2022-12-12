import { hidePropertiesIn, hidePropertyIn, Problem, Properties, PropertyGroup } from "@mendix/pluggable-widgets-tools";
import { MxBaseProps, PosRotScaleTypeEnum } from "../typings/MxBaseProps";

export function getPropertiesBase(values: MxBaseProps, defaultProperties: PropertyGroup[]): Properties {
    if (values.mxMaterialOption === "Color") {
        hidePropertyIn(defaultProperties, values, "mxMaterialTexture");
    } else if (values.mxMaterialOption === "Texture") {
        hidePropertyIn(defaultProperties, values, "mxMaterialColor");
    }
    if (values.mxLightingType === "Simple") {
        hidePropertiesIn(defaultProperties, values, ["mxRoughness", "mxMetalness"]);
    }
    if (!values.mxUseDraggingInteraction) {
        hidePropertiesIn(defaultProperties, values, ["mxDraggingEnabled", "mxDragType", "mxOnDrag"]);
    }
    if (!values.mxUsePinchInteraction) {
        hidePropertiesIn(defaultProperties, values, [
            "mxPinchEnabled",
            "mxPinchToScaleEnabled",
            "mxOnPinchActionValue"
        ]);
    }
    if (!values.mxPinchEnabled) {
        hidePropertiesIn(defaultProperties, values, ["mxPinchToScaleEnabled", "mxOnPinchActionValue"]);
    }
    if (values.mxPositionType !== PosRotScaleTypeEnum.Attribute) {
        hidePropertiesIn(defaultProperties, values, ["mxPositionXAtt", "mxPositionYAtt", "mxPositionZAtt"]);
    }
    if (values.mxPositionType !== PosRotScaleTypeEnum.Expression) {
        hidePropertiesIn(defaultProperties, values, ["mxPositionXExpr", "mxPositionYExpr", "mxPositionZExpr"]);
    }
    if (values.mxPositionType !== PosRotScaleTypeEnum.Static) {
        hidePropertiesIn(defaultProperties, values, ["mxPositionXStat", "mxPositionYStat", "mxPositionZStat"]);
    }

    if (values.mxRotationType !== PosRotScaleTypeEnum.Attribute) {
        hidePropertiesIn(defaultProperties, values, ["mxRotationXAtt", "mxRotationYAtt", "mxRotationZAtt"]);
    }
    if (values.mxRotationType !== PosRotScaleTypeEnum.Expression) {
        hidePropertiesIn(defaultProperties, values, ["mxRotationXExpr", "mxRotationYExpr", "mxRotationZExpr"]);
    }
    if (values.mxRotationType !== PosRotScaleTypeEnum.Static) {
        hidePropertiesIn(defaultProperties, values, ["mxRotationXStat", "mxRotationYStat", "mxRotationZStat"]);
    }

    if (values.mxScaleType !== PosRotScaleTypeEnum.Attribute) {
        hidePropertiesIn(defaultProperties, values, ["mxScaleXAtt", "mxScaleYAtt", "mxScaleZAtt"]);
    }
    if (values.mxScaleType !== PosRotScaleTypeEnum.Expression) {
        hidePropertiesIn(defaultProperties, values, ["mxScaleXExpr", "mxScaleYExpr", "mxScaleZExpr"]);
    }
    if (values.mxScaleType !== PosRotScaleTypeEnum.Static) {
        hidePropertiesIn(defaultProperties, values, ["mxScaleXStat", "mxScaleYStat", "mxScaleZStat"]);
    }
    return defaultProperties;
}

export function checkBase(values: MxBaseProps): Problem[] {
    const errors: Problem[] = [];
    if (values.mxPositionType === PosRotScaleTypeEnum.Attribute) {
        if (!values.mxPositionXAtt) {
            errors.push({
                property: "mxPositionXAtt",
                message: "Position X attribute should not be empty"
            });
        }
        if (!values.mxPositionYAtt) {
            errors.push({
                property: "mxPositionYAtt",
                message: "Position Y attribute should not be empty",
                url: ""
            });
        }
        if (!values.mxPositionZAtt) {
            errors.push({
                property: "mxPositionZAtt",
                message: "Position Z attribute should not be empty"
            });
        }
    }
    if (values.mxRotationType === PosRotScaleTypeEnum.Attribute) {
        if (!values.mxRotationXAtt) {
            errors.push({
                property: "mxRotationXAtt",
                message: "Rotation X attribute should not be empty"
            });
        }
        if (!values.mxRotationYAtt) {
            errors.push({
                property: "mxRotationYAtt",
                message: "Rotation Y attribute should not be empty"
            });
        }
        if (!values.mxRotationZAtt) {
            errors.push({
                property: "mxRotationZAtt",
                message: "Rotation Z attribute should not be empty"
            });
        }
    }
    if (values.mxScaleType === PosRotScaleTypeEnum.Attribute) {
        if (!values.mxScaleXAtt) {
            errors.push({
                property: "mxScaleXAtt",
                message: "Scale X attribute should not be empty"
            });
        }
        if (!values.mxScaleYAtt) {
            errors.push({
                property: "mxScaleYAtt",
                message: "Scale Y attribute should not be empty"
            });
        }
        if (!values.mxScaleZAtt) {
            errors.push({
                property: "mxScaleZAtt",
                message: "Scale Z attribute should not be empty",
                url: ""
            });
        }
    }
    if (values.mxScaleType === PosRotScaleTypeEnum.Expression) {
        if (Number(values.mxScaleXExpr) === 0) {
            errors.push({
                property: "mxScaleXExpr",
                message: " Scale X is 0, this could mean the model will not be visible.",
                severity: "warning"
            });
        }
        if (Number(values.mxScaleYExpr) === 0) {
            errors.push({
                property: "mxScaleYExpr",
                message: " Scale Y is 0, this could mean the model will not be visible.",
                severity: "warning",
                url: ""
            });
        }
        if (Number(values.mxScaleZExpr) === 0) {
            errors.push({
                property: "mxScaleZExpr",
                message: " Scale Z is 0, this could mean the model will not be visible.",
                severity: "warning"
            });
        }
        if (Number(values.mxOpacity) === 0) {
            errors.push({
                property: "mxOpacity",
                message:
                    "Opacity of object is 0, this makes the object completely invisible and seem like it's not rendering",
                severity: "warning"
            });
        }
    }
    if (values.mxMaterialOption === "Texture" && !values.mxMaterialTexture) {
        errors.push({
            property: "mxMaterialTexture",
            message: "Texture was selected as material option, but no texture was provided. Please add an image."
        });
    }
    return errors;
}
