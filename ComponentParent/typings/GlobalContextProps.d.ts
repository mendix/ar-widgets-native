export type EngineContext = {
    scene?: Scene;
    featuresManager?: WebXRFeaturesManager;
    xrActive: boolean;
    pinchScale: number;
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
