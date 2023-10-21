
import { GET_USERS } from "../actions/usersAction";

const initialState = {};

export const usersReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_USERS : 
        return {
            ...state,
            users2 : action.payload
        };
        default : 
        return state
    }
}