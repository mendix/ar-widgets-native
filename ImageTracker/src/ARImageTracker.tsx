import React, { createElement, useContext, useEffect, useState } from "react";
import { Style } from "mendix";
import { ARImageTrackerProps } from "../typings/ARImageTrackerProps";
import { MeshComponent } from "../../ComponentParent/src/MeshComponent";
import { Scene, Mesh } from "@babylonjs/core";
import { EngineContext, GlobalContext } from "../../ComponentParent/typings/GlobalContextProps";
import Big from "big.js";
import { Image } from "react-native";

export function ARImageTracker(props: ARImageTrackerProps<Style>): React.ReactElement | void {
    const globalContext = global as GlobalContext;
    const engineContext: EngineContext = useContext(globalContext.EngineContext);
    const [imagetrackerParent, setImageTrackerParent] = useState<Mesh>();
    const [parentID, setParentID] = useState<number>(NaN);
    const [imageURL, setImageURL] = useState<string>();

    const handleSceneLoaded = (scene: Scene) => {
        const localImageTracker = new Mesh(props.name, scene);
        localImageTracker.setEnabled(false);
        setImageTrackerParent(localImageTracker);
        setParentID(localImageTracker.uniqueId);
    };

    useEffect(() => {
        if (props.mxImage.value !== undefined) {
            if (typeof props.mxImage.value === "string") {
                setImageURL(props.mxImage.value);
            } else if (typeof props.mxImage.value === "number") {
                setImageURL(Image.resolveAssetSource(props.mxImage.value).uri);
            } else if (typeof props.mxImage.value === "object") {
                setImageURL(`file://${props.mxImage.value.uri}`);
            } else {
                if (imageURL !== undefined) {
                    const currentEntry = { src: imageURL, estimatedRealWorldWidth: Number(props.mxPhysicalMarkerSize) };

                    engineContext.setImageTrackingOptions(prev =>
                        prev !== undefined
                            ? prev.includes(currentEntry)
                                ? prev.filter(entry => entry !== currentEntry)
                                : [...prev]
                            : [prev]
                    );
                }
                setImageURL(undefined);
            }
        }
    }, [props.mxImage.value]);

    useEffect(() => {
        if (imageURL !== undefined) {
            const newEntry = { src: imageURL, estimatedRealWorldWidth: Number(props.mxPhysicalMarkerSize) };
            engineContext.setImageTrackingOptions(prev =>
                prev !== undefined ? (prev.includes(newEntry) ? [...prev] : [...prev, newEntry]) : [newEntry]
            );
        }
    }, [imageURL]);

    useEffect(() => {
        if (!engineContext?.xrActive && imagetrackerParent && imagetrackerParent.isEnabled()) {
            imagetrackerParent.setEnabled(false);
        }
    }, [engineContext?.xrActive, imagetrackerParent]);

    useEffect(() => {
        if (
            engineContext?.trackedImageLocation &&
            engineContext?.trackedImageLocation.src === imageURL &&
            engineContext?.trackedImageLocation.matrix &&
            imagetrackerParent !== undefined
        ) {
            engineContext?.trackedImageLocation.matrix.decomposeToTransformNode(imagetrackerParent);
            if (props.mxOrientation === "Up") {
                // Change nothing
            } else if (props.mxOrientation === "Down") {
                imagetrackerParent.addRotation(180 * (Math.PI / 180), 0, 0);
            } else if (props.mxOrientation === "Left") {
                imagetrackerParent.addRotation(0, 90 * (Math.PI / 180), 0);
            } else if (props.mxOrientation === "Right") {
                imagetrackerParent.addRotation(0, -90 * (Math.PI / 180), 0);
            }
            if (!imagetrackerParent.isEnabled()) {
                imagetrackerParent.setEnabled(true);
                if (props.mxOnAnchorFound?.canExecute && !props.mxOnAnchorFound.isExecuting) {
                    props.mxOnAnchorFound.execute();
                }
            }
        }
    }, [engineContext?.trackedImageLocation]);

    return (
        <>
            <MeshComponent
                mesh={imagetrackerParent}
                mxPositionType={"Static"}
                mxPositionXStat={Big(0)}
                mxPositionYStat={Big(0)}
                mxPositionZStat={Big(0)}
                mxRotationType={"Static"}
                mxRotationXStat={Big(0)}
                mxRotationYStat={Big(0)}
                mxRotationZStat={Big(0)}
                mxScaleType={"Static"}
                mxScaleXStat={Big(1)}
                mxScaleYStat={Big(1)}
                mxScaleZStat={Big(1)}
                OnSceneLoaded={handleSceneLoaded}
            />
            <globalContext.ParentContext.Provider value={parentID}>
                {props.mxContent}
            </globalContext.ParentContext.Provider>
        </>
    );
}
