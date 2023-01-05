import { ReactNode, useEffect, useRef, useState } from "react";
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";

export type BabylonjsProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  renderChildrenWhenReady?: boolean;
  sceneOptions?: SceneOptions;
  onSceneReady: (scene: Scene) => void;
  /**
   * Automatically trigger engine resize when the canvas resizes (default: true)
   */
  observeCanvasResize?: boolean;
  onRender?: (scene: Scene) => void;
  children?: React.ReactNode;
};

export default (props: BabylonjsProps) => {
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    renderChildrenWhenReady,
    sceneOptions,
    onSceneReady,
    /**
     * Automatically trigger engine resize when the canvas resizes (default: true)
     */
    observeCanvasResize,
    onRender,
    children,
  } = props;
  const reactCanvas = useRef(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;
    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      if (scene.activeCamera !== null) {
        scene.render();
      }
    });
    engine.setSize(
      (canvas as any).parentNode.getBoundingClientRect().width,
      (canvas as any).parentNode.getBoundingClientRect().height,
      true
    );
    return () => {
      scene.getEngine().dispose();
    };
  }, [reactCanvas]);

  return <canvas ref={reactCanvas} style={{ width: "100%", height: "100%" }} />;
};
