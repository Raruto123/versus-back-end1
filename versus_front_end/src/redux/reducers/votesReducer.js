import { GET_VOTES } from "../actions/votesAction";

const initialState = {};

export const votesReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_VOTES : 
        return{
            ...state,
            votes : action.payload
        };
        default : 
        return state
    }
}