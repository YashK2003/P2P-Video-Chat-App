import photo1 from "./homepageutils/download.png";
import "./conversation.css"
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoopCircleLoading from './loader'

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    console.log("freindID is -> ", friendId);
    console.log("userid is -> ", currentUser._id);
    const getUser = async () => {
      // try {
      //   const res = await axios("/users?userId=" + friendId);
      //   setUser(res.data);
      // } catch (err) {
      //   console.log(err);
      // }
      const sendobj = {
        id: friendId
      }
      let st1 = process.env.REACT_APP_IP;
      let st2 = "/data/getuserdata";
      let result = st1.concat(st2);
      console.log(result);
      axios
        .post(result , sendobj)
        .then(respe => {
          if (respe.data === "Invalid Credentials") {
            console.log("invalid");
            //   window.alert("Invalid Credentials");

          } else {
            // console.log("valid");
            // console.log(" -- > data in ", respe.data[0]);
            setUser(respe.data[0]);
            // console.log("user after setting is" ,user)
            // fname = respe.data[0].FirstName;

           
            // console.log("here the state is :" , this.state.userData.followers)
            // localStorage.setItem("access-token", res.data);
            // (window.location.href = "/main")

          }
        })
        .catch(err => {
          console.log(" ----------> here we got an error");
        });


    };
    getUser();
  }, [currentUser, conversation]);

  if (!user) {
    return <div className= "App"><LoopCircleLoading/></div>;
  }

  const redirect=(e)=>{
    // console.log("ndvkjwnv" , user);
    let redirecturl = `/chbx/${conversation._id}`
    navigate(redirecturl);
  } 

  return (
    <div onClick={()=>{redirect()}} className="conversation">
      <img
        className="conversationImg"
        src={photo1}
        alt=""
      />
      <span style={{ color: "black" }} className="">{user.Name}</span>
    </div>
  );
}

// {user.Name}