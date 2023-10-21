import axios from "axios";

export const GET_USERS = "GET_USERS";

export const getUsers = () => {
    return(dispatch) => {
        return axios({
            method : "get",
            url : "http://localhost:3100/api/user"
        }
        ).then((res) => {
            console.log(res);
            dispatch({type : GET_USERS, payload : res.data});
        }).catch((err) => {
            console.log((err));
        })
    }
} 