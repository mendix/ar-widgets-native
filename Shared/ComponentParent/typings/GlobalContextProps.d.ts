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
const enum State {
    UNDETERMINED = 0,
    FAILED = 1,
    BEGAN = 2,
    CANCELLED = 3,
    ACTIVE = 4,
    END = 5
}

export type GlobalContext = {
    EngineContext?: Context<EngineContext>;
    ParentContext?: Context<number>;
};
