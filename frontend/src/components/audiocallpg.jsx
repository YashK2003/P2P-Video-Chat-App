import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./socketprovider";
import axios from "axios";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from '@mui/material';
import { GoFile } from "react-icons/go";
// import { IoArrowBackCircleOutline } from "react-icons/io5";

const inputstyle = {
    border: "3px solid #B0DAFF",
    width: "80%",
    height: "35px",
    fontSize: "20px"
}

const Audiocallpg = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const { socket, callEnded } = useSocket()
    const navigate = useNavigate();

    // to toggle between buttons
    const [linktocall, setLinktocall] = useState("");
    const [joinacall, setJoinacall] = useState("");
    const [me, setMe] = useState("")

    const handleSetCall = () => {
        setLinktocall("1");
    };

    const handlejoincall = () => {
        setJoinacall("1");
    };

    const handleback = () => {
        // navigate("/lobby")
        setLinktocall("")
        setJoinacall("")
    };


    // jwt code for getting email
    // ******
    const jwt = localStorage.getItem("access-token");
    if (!jwt) {
        (window.location.href = "/login")
    } else {
        let st1 = process.env.REACT_APP_IP;
        let st2 = "/auth";
        let result = st1.concat(st2);
        // console.log(result);
        axios
            .get(result, {
                headers: { authorization: `Bearer: ${jwt}` }
            })
            .then(res => {
                // console.log("VERIFIED USER");
                // console.log(res.data);
                setEmail(res.data.Email);
                setMe(res.data.Category);
            })
            .catch(err => {
                console.log("error here is -->  ", JSON.stringify(err));
                localStorage.removeItem("access-token");
                (window.location.href = "/login")
            });
    }

    const handleSubmitForm = useCallback(
        (e) => {
            console.log("JOINED")
            e.preventDefault();
            socket.emit("room:join", { email, room });

        },
        [email, room, socket]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const { email, room } = data;
            console.log("email", email)
            navigate(`/audioroom/${room}`);
        },
        [navigate]
    );

    useEffect(() => {
        socket.on("me", (id) => {
            console.log(id)
        })
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);

    return (
        <div className="App">
            <div>
                <h1 style={{ marginTop: "22%", textAlign: "center", fontFamily: 'Caveat' }}>Make a audio call </h1>
                <form onSubmit={handleSubmitForm}>

                        <br />
                        <div align="center">
                            <h3 style={{ marginTop: "20px" }}> Paste the Link here </h3>
                            <input
                                style={inputstyle}
                                type="text"
                                id="room"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                            <br />
                            <button
                                style={{ marginTop: "20px", width: "80%", height: "40px", backgroundColor: "#DAF5FF", borderRadius: '10px', fontSize: '20px', color: "black" }}
                            >Join</button>
                        </div>
                </form>
            </div>
            <Button variant='contained' style={{ margin: "auto", width: "80%", backgroundColor: "#DAF5FF", color: "black" }} onClick={() => { navigate("/home") }}> Go to home  </Button>

        </div>
    );
};

export default Audiocallpg;