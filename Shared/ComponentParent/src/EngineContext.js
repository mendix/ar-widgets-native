//These contexts are defined here and set as global, since we need to access the same consts from different widgets.
import React from "react";
const global = globalThis;
export const EngineContext = React.createContext({});
export const ParentContext = React.createContext(NaN);
global.EngineContext = EngineContext;
global.ParentContext = ParentContext;
//# sourceMappingURL=EngineContext.js.map