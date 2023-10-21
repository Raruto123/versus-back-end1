import axios from "axios";

export const GET_VOTES = "GET_VOTES";

export const getVotes = () => {
    return (dispatch) => {
        return axios({
            method : "get",
            url : "http;//localhost:3100/api/votes"
        }).then((res) => {
            dispatch({
                type : GET_VOTES, payload : res.data
            })
        }).catch((error) => {
            console.log(error)
        })
    }
}