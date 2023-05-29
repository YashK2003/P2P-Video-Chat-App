import React, { useContext } from 'react';
import { SocketContext } from '../SocketContext';
import { Grid, Typography, Paper } from '@mui/material';
import Optionspg from "./options";

const mystyle = {
    height: "43%",
    color: "black",
    width: "90%",
    margin: "5%",
    backgroundColor: "#87CEEB",
}


const vidmystyle = {
    border: "2px solid",
    height: "100px",
    color: "black",
    width: "100px",
    margin: "5%",
    marginTop: "0%",
}


const Videoplayer = () => {

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

    return (
        <div className="fApp">
            <h1> "HEllO this is video page " </h1>

            {stream && (
                <Paper style={mystyle}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                        <video playsInline muted ref={myVideo} autoPlay style={vidmystyle} />
                    </Grid>
                </Paper>
            )}

            

            {callAccepted && !callEnded && (
                <Paper style={mystyle}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                        <video playsInline muted ref={userVideo} autoPlay style={vidmystyle} />
                    </Grid>
                </Paper>
            )}

            <Optionspg />


        </div>
    );
};


export default Videoplayer;