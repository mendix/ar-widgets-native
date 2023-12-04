import React, { createElement, useEffect, useState } from "react";
import { ARTextProps } from "../typings/ARTextProps";
import { Style } from "mendix";
import { SharedARText } from "../../../Shared/ComponentParent/src/SharedARText";
import { Scene, Texture } from "@babylonjs/core";
import { retrieveImageFromNumber } from "../../../Shared/ComponentParent/src/retrieveImageFromNumber";

export function ARText(props: ARTextProps<Style>): React.ReactElement {
    const { mxMaterialTexture } = props;
    const [texture, setTexture] = useState<Texture>();
    const [scene, setScene] = useState<Scene>();

    useEffect(() => {
        if (mxMaterialTexture !== undefined && scene) {
            if (typeof mxMaterialTexture.value === "string") {
                setTexture(new Texture(mxMaterialTexture.value, scene));
            } else if (typeof mxMaterialTexture.value === "number") {
                retrieveImageFromNumber(mxMaterialTexture.value)
                    .then(uri => {
                        setTexture(new Texture(uri, scene));
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else if (typeof mxMaterialTexture.value === "object") {
                setTexture(new Texture(`file://${mxMaterialTexture.value.uri}`));
            }
        }
    }, [mxMaterialTexture, scene]);

    return (
        <SharedARText
            compiledTexture={texture}
            handleSceneLoaded={newScene => {
                setScene(newScene);
            }}
            useGizmo={false}
            {...props}
        />
    );
}
