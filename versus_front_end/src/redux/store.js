import {applyMiddleware, legacy_createStore} from "redux";
import thunk from "redux-thunk";
import {rootReducer} from "./rootReducer";
import { getUsers } from "./actions/usersAction.js";
import { getVotes } from "./actions/votesAction.js";

//dev tools
import {composeWithDevTools} from "@redux-devtools/extension";

export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

store.dispatch(getUsers());
store.dispatch(getVotes());