import { combineReducers } from "redux";
import { userReducer } from "./reducers/userReducer";
import { usersReducer } from "./reducers/usersReducer";

export const rootReducer = combineReducers({
    user : userReducer,
    users1 : usersReducer
})