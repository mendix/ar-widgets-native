//These contexts are defined here and set as global, since we need to access the same consts from different widgets.
import React from "react";
import { GlobalContext } from "../typings/GlobalContextProps";

const global = globalThis;
export const EngineContext = React.createContext({});
export const ParentContext = React.createContext<number>(NaN);
(global as GlobalContext).EngineContext = EngineContext;
(global as GlobalContext).ParentContext = ParentContext;
