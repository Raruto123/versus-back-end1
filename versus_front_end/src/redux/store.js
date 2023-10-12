import {applyMiddleware, legacy_createStore as createStore, legacy_createStore} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer.js";

//dev tools
import {composeWithDevTools} from "@redux-devtools/extension";

export const store = legacy_createStore(rootReducer, composeWithDevTools(thunk));