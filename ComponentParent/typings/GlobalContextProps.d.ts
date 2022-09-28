export type EngineContext = {
    scene?: Scene;
    featuresManager?: WebXRFeaturesManager;
    xrActive: boolean;
    pinchScale: number;
    pickedIDClicked: Array<number>;
    setPickedIDClicked: React.Dispatch<React.SetStateAction<Array<number>>>;
    hoveringMeshID: number;
    setImageTrackingOptions: React.Dispatch<
        React.SetStateAction<
            Array<{
                src: string | number;
                estimatedRealWorldWidth: number;
            }>
        >
    >;
    trackedImageLocation: { src: string; matrix: Matrix };
    scaleState: State;
};

export type GlobalContext = {
    EngineContext?: Context<EngineContext>;
    ParentContext?: Context<number>;
};
