import React from 'react';
import axios from 'axios';
import Message from './message';
import "./chatbox.css"
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"
import { IKContext, IKUpload } from 'imagekitio-react';
import { BiSend } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import LoopCircleLoading from './loader'

// required parameter to fetch images
const urlEndpoint = 'https://ik.imagekit.io/tb5em07q5';

// optional parameters (needed for client-side upload)
const publicKey = 'public_n1qVVkAdBe09dzJ2xXnLSzx6wxY=';
// const authenticationEndpoint = 'http://localhost:3000/auth';

// const authenticationEndpoint = 'http://localhost:4000/authimg';
let st1 = process.env.REACT_APP_IP;
let st2 = "/authimg";
let result = st1.concat(st2);
console.log(result);
const authenticationEndpoint = result;


export const Chatboxpage = () => {

    const [userdet, setUserdet] = useState([]);
    useEffect(() => {
        const jwt = localStorage.getItem("access-token");
        if (!jwt) {
            (window.location.href = "/login")
        } else {
            st1 = process.env.REACT_APP_IP;
            st2 = "/auth";
            result = st1.concat(st2);
            console.log(result);
            axios
                // .get("http://localhost:4000/auth", {
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
    }, [userdet._id]);

    const [uploadflag, setUploadflag] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const { id } = useParams();
    const user = userdet

    // const [socket, setSocket] = useState(null);
    const socket = useRef();
    useEffect(() => {
        st1 = process.env.REACT_APP_IP;
        // socket.current = io("http://localhost:4000");
        socket.current = io(st1);
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        // console.log("arrivalMessage is ", arrivalMessage);
        arrivalMessage &&
            currentChat.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            // console.log(users);
        });
    }, [user]);


    useEffect(() => {
        const getMessages = async () => {
            // try {
            //     const res = await axios.get("/messages/" + currentChat?._id);
            //     setMessages(res.data);
            // } catch (err) {
            //     console.log(err);
            // }
            const detailsobj = {
                convid: id,
            }
            st1 = process.env.REACT_APP_IP;
            st2 = "/mess/getmess";
            result = st1.concat(st2);
            console.log(result);
            axios
                // .post("http://localhost:4000/mess/getmess", detailsobj)
                .post(result, detailsobj)
                .then(res => {
                    // console.log("success!! in getmess");
                    // console.log(res.data)
                    setMessages(res.data);
                })
                .catch(err => {
                    console.log(" ----------> here we got an error");
                });
        };
        getMessages();
        // eslint-disable-next-line
    }, [currentChat]);

    useEffect(() => {
        const getConversations = async () => {
            const detailsobj = {
                cnid: id,
            }
            st1 = process.env.REACT_APP_IP;
            st2 = "/conv/togetrec";
            result = st1.concat(st2);
            console.log(result);
            axios
                // .post("http://localhost:4000/conv/togetrec", detailsobj)
                .post(result, detailsobj)
                .then(res => {
                    // console.log("success!!");
                    // console.log("my recievre can be found" , res.data[0].members)
                    setCurrentChat(res.data[0].members)
                })
                .catch(err => {
                    console.log(" ----------> here we got an error");
                });
        };
        getConversations();
        // eslint-disable-next-line
    }, [user._id]);

    if (!userdet) {
        return <div className= "App"><LoopCircleLoading/></div>;
    }

    if (!messages) {
        return <div className= "App"><LoopCircleLoading/></div>;
    }

    if (!currentChat) {
        return <div className= "App"><LoopCircleLoading/></div>;
    }

    const handleuploadfg = async (e) => {
        e.preventDefault();
        if (uploadflag === "") {
            setUploadflag("show")
        }
        else {
            setUploadflag("")
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: id,
        };

        const receiverId = currentChat.find(
            (member) => member !== user._id
        );


        // console.log("wjvnwovn" , receiverId)

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            st1 = process.env.REACT_APP_IP;
            st2 = "/mess";
            result = st1.concat(st2);
            console.log(result);
            // const res = await axios.post("http://localhost:4000/mess", message);
            const res = await axios.post(result, message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }

        // console.log(message);
    }

    // ************************
    // console.log("messages are -> " , messages);
    const onError = err => {
        console.log("Error", err);
    };

    const onSuccess = async (res) => {
        setUploadflag("")
        console.log("Success", res.url);
        setNewMessage(res.url);
        handleSubmit();
        const message = {
            sender: user._id,
            text: res.url,
            conversationId: id,
        };

        const receiverId = currentChat.find(
            (member) => member !== user._id
        );

        // console.log("wjvnwovn" , receiverId)

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: res.url,
        });

        try {
            st1 = process.env.REACT_APP_IP;
            st2 = "/mess";
            result = st1.concat(st2);
            console.log(result);
            // const res = await axios.post("http://localhost:4000/mess", message);
            const res = await axios.post(result, message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="App">

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    <div className="chatBoxTop">
                        {messages.map((m, index) => (
                            <Message key={index} message={m} own={m.sender === user._id} />
                        ))}

                    </div>
                    <div className="chatBoxBottom2">
                        <textarea
                            style={{ borderRadius: "10px", marginRight: "0px" }}
                            className="chatMessageInput"
                            placeholder="write something..."
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage}
                        ></textarea>
                        {/* <form action="http://localhost:4000/mess" method="POST" enctype="multipart/form-data"> */}
                        {/* <input type="file" id="file" name="file" onChange={fileselectedhandler} /> */}
                        {/*  <button onClick={fileuploadhandler}>Upload</button> */}
                        {/* </form> */}
                        {/* <IKImage
                            urlEndpoint={urlEndpoint}
                            path="default-image.jpg"
                        /> */}



                        {newMessage && (
                            <button className="chatSubmitButton" onClick={handleSubmit}>
                                <BiSend style={{ fontSize: "30px", align: "center", marginTop: "3px", marginLeft: "3px" }} />
                            </button>
                        )}

                        <button className="chatSubmitButton" onClick={handleuploadfg}>
                            <AiOutlinePlus style={{ fontSize: "30px", align: "center", marginTop: "3px", marginLeft: "3px" }} />
                        </button>


                    </div>
                    <div className="chatBoxBottom">
                        <IKContext
                            urlEndpoint={urlEndpoint}
                            publicKey={publicKey}
                            authenticationEndpoint={authenticationEndpoint}
                        >

                            {uploadflag &&
                                <IKUpload
                                    fileName="test-upload.png"
                                    onError={onError}
                                    onSuccess={onSuccess}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px',
                                        border: '2px dashed #ccc',
                                        marginBottom: '30px'
                                    }}
                                />}
                        </IKContext>
                    </div>
                </div>
            </div>
        </div >
    );
};