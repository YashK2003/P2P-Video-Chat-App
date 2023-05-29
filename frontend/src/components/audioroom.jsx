import React, { useRef, useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "./peer";
import { useSocket } from "./socketprovider";
import { MdOutlineCallEnd } from "react-icons/md";
import { BsCameraVideoOff, BsMicMute, BsMic, BsCameraVideo } from "react-icons/bs";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WaveLoading from './loader2'

// styling
const vidbox1 = {
  marginBottom: "5px",
  marginTop: "7px",
  marginLeft: "7px",
  height: "35%",
  width: "95%",
  backgroundColor: "#87CEEB",
  borderRadius: "10px",
  alignItems: "center",
};

const vidbox2 = {
  // marginBottom: "0px",
  marginTop: "7px",
  marginLeft: "7px",
  height: "35%",
  width: "95%",
  backgroundColor: "#87CEEB",
  borderRadius: "10px",
};

const audioboxstyle = {
  marginBottom: "0px",
  marginTop: "7px",
  marginLeft: "7px",
  height: "95%",
  width: "95%",
  backgroundColor: "#87CEEB",
  borderRadius: "10px",
  alignItems: "center",
};


const RoomPage = () => {
  const { socket, callEnded, leaveCall } = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  // const call
  const [removess, setRemovess] = useState();
  const [miconoff, setMiconoff] = useState(true);
  const [videoonoff, setVideoonoff] = useState(true);

  // remove the forward video
  const [closevideo, setClosevideo] = useState(false);

  // remove the forward audio
  const [closeaudio, setCloseaudio] = useState(false);
  const navigate = useNavigate();


  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia is not supported');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setMyStream(stream);
      console.log("mystream is", stream);

      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  //   const sendStreams = useCallback(() => {
  //     for (const track of myStream.getTracks()) {
  //       peer.peer.addTrack(track, myStream);
  //     }
  //   }, [myStream]);

  const sendStreams = useCallback(() => {
    setRemovess("1");
    for (const track of myStream.getTracks()) {
      const sender = peer.peer.getSenders().find((s) => s.track === track);
      if (!sender) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream, peer]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStreamtemp = ev.streams;
      console.log("GOT TRACKS!!");
      console.log("remoteStream is", remoteStreamtemp);
      setRemoteStream(remoteStreamtemp[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("getUsers", (data) => {
      console.log(data.users)
    })

    socket.on("closevideo:call", (data) => {
      console.log("reached here step-2 !!!-> ")
      setClosevideo(true)
    })

    socket.on("openvideo:call", (data) => {
      console.log("reached here step-2 !!!-> ")
      setClosevideo(false)
    })

    socket.on("closeaudio:call", (data) => {
      console.log("reached here step-2 !!!-> ")
      setCloseaudio(true)
    })

    socket.on("openaudio:call", (data) => {
      console.log("reached here step-2 !!!-> ")
      setCloseaudio(false)
    })

    socket.on("hangupcallnow:call", (data) => {
      navigate("/callclosed")
    })
    
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  // functions for buttons 
  function callhangup() {
    // video call  end implementation
    socket.emit("userhangup:call", { to: remoteSocketId });
    navigate("/lobby")
  }

  function micmute() {
    // mute the audio implementation
    // console.log("micmute")
    if (miconoff)
      setMiconoff(false)
    else
      setMiconoff(true)

      if (miconoff) {
        socket.emit("useraudioclose:call", { to: remoteSocketId });
      }
      else {
        socket.emit("useraudioopen:call", { to: remoteSocketId });
      }
  }

  function videoclose() {
    // close the video end implementation
    console.log("videoclose")
    if (videoonoff)
      setVideoonoff(false)
    else
      setVideoonoff(true)

    if (videoonoff) {
      socket.emit("uservideoclose:call", { to: remoteSocketId });
    }
    else {
      socket.emit("uservideoopen:call", { to: remoteSocketId });
    }

  }

  function VideoStream({ stream }) {
    useEffect(() => {
      if (stream) {
        // Set the `srcObject` property of the video element to the media stream
        const videoElement = document.getElementById('video-element');
        videoElement.srcObject = stream;

        // Play the video
        videoElement.play();
      }
    }, [stream]);

    return (
      <div>
        <video id="video-element" width="1%" height="1%" muted={closeaudio}/>
      </div>
    );
  }

  return (
    <div className="App">
      {
        !remoteSocketId &&
        <h1 style={{ marginTop: "70%", textAlign: "center" }}>{remoteSocketId ? "" : "No one in room"}</h1>
      }


      {!removess && myStream && <Button variant='contained' style={{marginTop: "5%",marginLeft: "10%",marginBottom: "10px",width:"80%", backgroundColor:"#DAF5FF", color:"black"}} onClick={sendStreams}> Send Stream  </Button>}
      

      {!myStream && remoteSocketId && <Button variant='contained' style={{marginTop: "70%",marginLeft: "10%",marginBottom: "2000px",width:"80%", backgroundColor:"#DAF5FF", color:"black"}} onClick={handleCallUser}> Join a call  </Button>}
      

      {myStream && videoonoff && (
        <div style={audioboxstyle}>
          {/* <h1>My Stream</h1> */}
          <ReactPlayer
            playing
            muted
            height="100%"
            width="100%"
            url={myStream}
          />
          <WaveLoading />
        </div>
      )}

     


      {remoteStream && !closevideo && (
        <>
          {/* <h1>Remote Stream</h1> */}
          <VideoStream stream={remoteStream} />
        </>
      )}

      <br /><br />
      {
        remoteSocketId &&
      <div style={{ display: "flex", alignItems: "center", marginBottom: "170px" }}>

        {
          !miconoff && 
          (<button style={{ cursor: "pointer", marginLeft: "33%", marginRight: "25px", border: "2px solid black", borderRadius: "100%", backgroundColor: "white", width: "55px", height: "55px" }} onClick={micmute}>
            <BsMicMute style={{ fontSize: "30px", align: "center", marginTop: "0px", marginLeft: "3px" }} />
          </button>)
        }

        {
          miconoff && 
          (<button style={{ cursor: "pointer", marginLeft: "33%", marginRight: "25px", border: "2px solid black", borderRadius: "100%", backgroundColor: "white", width: "55px", height: "55px" }} onClick={micmute}>
            <BsMic style={{ fontSize: "30px", align: "center", marginTop: "0px", marginLeft: "3px" }} />
          </button>)
        }

        

        { 
          <button style={{ cursor: "pointer", marginRight: "25px", border: "2px solid black", borderRadius: "100%", backgroundColor: "red", width: "55px", height: "55px" }} onClick={callhangup}>
            <MdOutlineCallEnd style={{ fontSize: "35px", align: "center", marginTop: "0px", marginLeft: "3px" }} />
          </button>
        }


      </div>
      }




    </div>
  );
};

export default RoomPage;
