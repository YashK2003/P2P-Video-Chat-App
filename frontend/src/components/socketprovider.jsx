import React, { createContext, useMemo, useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  // const socket = useMemo(() => io("localhost:8900"), []);
  let st1 = process.env.REACT_APP_IP;
  let result = st1.split("/")
  // console.log("result is", result);
  // console.log(result[2]);
  const socket = useMemo(() => io(result[2]), []);
  const [callEnded, setCallEnded] = useState(false)
  const leaveCall = () => { }
  //   const leaveCall = () => {
  //     setCallEnded(true);

  //     connectionRef.current.destroy();

  //     window.location.reload();
  // };

  return (
    <SocketContext.Provider value={{ socket, callEnded, leaveCall }}>
      {props.children}
    </SocketContext.Provider>
  );
};