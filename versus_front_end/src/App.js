import { UidContext } from "./components/appContext";
import axios from "axios";
import { getUser } from "./redux/actions/userAction";
import { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import Trees from "./routes/tree";


function App() {
  const[uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async() => {
      await axios({
        method : "get",
        url : "http://localhost:3100/jwtid"
      }).then((res) => {
        console.log(res);
        setUid(res.data);
      }).catch((error) => {
        console.log("No Token")
      })
    };
    fetchToken();
  }, [setUid]);

  if (uid) {
    dispatch(getUser(uid));
  };

  return(

    <UidContext.Provider value={uid}>
      <Trees></Trees>
    </UidContext.Provider>
  )



}

export default App;
