import React, { createElement, useEffect, useState } from "react";
import { WebXRTextContainerProps } from "../typings/WebXRTextProps";
import { SharedARText } from "../../../Shared/ComponentParent/src/SharedARText";
import { Scene, Texture } from "@babylonjs/core";

export function WebXRText(props: WebXRTextContainerProps): React.ReactElement {
    const { mxMaterialTexture } = props;
    const [texture, setTexture] = useState<Texture>();
    const [scene, setScene] = useState<Scene>();

    useEffect(() => {
        if (mxMaterialTexture) {
            if (typeof mxMaterialTexture.value === "string") {
                // @ts-ignore - for some reason it thinks mxMaterialTexture is of type never, code does work though
                setTexture(new Texture(mxMaterialTexture.value, scene));
            } else if (typeof mxMaterialTexture.value === "object" && mxMaterialTexture.value.uri) {
                setTexture(new Texture(mxMaterialTexture.value.uri, scene));
            }
        }
    }, [mxMaterialTexture, scene]);

    return (
        <SharedARText
            compiledTexture={texture}
            handleSceneLoaded={newScene => {
                setScene(newScene);
            }}
            useGizmo={true}
            {...props}
        />
    );
}
