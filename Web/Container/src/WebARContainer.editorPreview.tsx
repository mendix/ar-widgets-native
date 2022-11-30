import { ReactElement, createElement } from "react";
import { WebARContainerPreviewProps } from "../typings/WebARContainerProps";
import { WebARContainer } from "./WebARContainer";
import { Big } from "big.js";

export function preview({}: WebARContainerPreviewProps): ReactElement {
    return (
        <WebARContainer
            name={""}
            class={""}
            mxContentWidget={undefined}
            mxUsePreview={false}
            mxPreviewCameraDistance={Big(1.5)}
            mxUsePBR={false}
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/WebARContainer.css");
}
