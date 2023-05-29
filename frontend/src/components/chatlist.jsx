import React from 'react';
import axios from 'axios';
import Conversation from './conversation';
import { useEffect, useState } from "react";
import { AiFillLock } from "react-icons/ai";
import { AiFillMessage } from "react-icons/ai";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { TiUserOutline } from "react-icons/ti";
import { AiOutlineHome } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import LoopCircleLoading from './loader'

export const Chatpage1 = () => {

    const [userdet, setUserdet] = useState([]);

    useEffect(() => {
        const jwt = localStorage.getItem("access-token");
        if (!jwt) {
            (window.location.href = "/login")
        } else {
            let st1 = process.env.REACT_APP_IP;
            let st2 = "/auth";
            let result = st1.concat(st2);
            console.log(result);
            axios
                .get(result, {
                    headers: { authorization: `Bearer: ${jwt}` }
                })
                .then(res => {
                    // console.log("VERIFIED USER", res.data);
                    setUserdet(res.data);
                })
                .catch(err => {
                    console.log("error here is -->  ", JSON.stringify(err));
                    localStorage.removeItem("access-token");
                    (window.location.href = "/login")
                });
        }
    }, [userdet]);

   

    const [conversations, setConversations] = useState([]);
    // const [currentChat, setCurrentChat] = useState(null);
    // const [messages, setMessages] = useState([]);

    const user = userdet
    // console.log("-> "  , user._id);
    useEffect(() => {
        const getConversations = async () => {
            const detailsobj = {
                userid: user._id,
            }
            let st1 = process.env.REACT_APP_IP;
            let st2 = "/conv/getconv";
            let result = st1.concat(st2);
            console.log(result);
            axios
                .post(result, detailsobj)
                .then(res => {
                    // console.log("success!!");
                    console.log(res.data)
                    setConversations(res.data);
                })
                .catch(err => {
                    console.log(" ----------> here we got an error");
                });
        };
        getConversations();
    }, [user._id]);

    const navigate=useNavigate()

    if (!userdet) {
        return <div className= "App"><LoopCircleLoading/></div>;
    }

    if (!conversations) {
        return <div className= "App"><LoopCircleLoading/></div>;
    }


    // var arr = ["test1", "test2", "test3", "test4", "test5", "test6"]

    return (
        <div className="App">
            <div>
                <h1 style={{ textAlign: "center", fontFamily: 'Caveat' }}>Chat with Friends </h1>
                <div style={{ backgroundColor: "#87CEEB", width: "85%", padding: "20px", marginLeft: "2%" }}>
                    <div className="chatMenu">
                        <div className="chatMenuWrapper">
                            {conversations.map((c) => (
                                <Conversation conversation={c} currentUser={user} />
                            ))}

                        </div>
                    </div>
                </div>
                <h4 style={{ textAlign: "center" }}> <AiFillLock /> Your chats are <span style={{ color: "lightgreen" }}>End to End encrypted</span></h4>
            </div>
            <div style={{ marginBottom: "11%" }}>
                <button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "8.25%" }} onClick={() => { navigate("/home") }}><AiOutlineHome /></button><button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "8.25%" }}><AiFillMessage /></button><button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "8.25%" }} onClick={() => { navigate("/lobby") }}><AiOutlineVideoCamera /></button><button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "8.25%" }} onClick={() => { navigate("/profile") }}><TiUserOutline /></button>
            </div>
        </div>
    );
};