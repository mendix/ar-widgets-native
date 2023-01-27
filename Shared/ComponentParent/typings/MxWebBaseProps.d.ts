import { ActionValue, DynamicValue, NativeImage, EditableValue } from "mendix";
import { Style } from "util";
import { MxBaseProps } from "./MxBaseProps";

export interface MxWebBaseProps extends MxBaseProps {
    mxUsePinchInteraction: boolean;
    mxPinchEnabled: DynamicValue<boolean>;
    mxPinchRotationEnabled: DynamicValue<boolean>;
    mxGizmoColor: DynamicValue<string>;
    mxGizmoSize: DynamicValue<Big>;
}
