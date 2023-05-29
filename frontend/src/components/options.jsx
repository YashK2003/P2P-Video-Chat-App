import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { AiFillPhone } from "react-icons/ai";
import { BiPhoneOff } from "react-icons/bi";
import { SocketContext } from '../SocketContext';
import { GoFile } from "react-icons/go";
import Notifications from "./notifications";

const Optionspg = () => {

    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');


    return (
            <Container >
                <Paper >
                    <form  noValidate autoComplete="off">
                        <Grid >
                            <Grid  >
                                <Typography gutterBottom variant="h6">Account Info</Typography>
                                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                                {console.log("me is -> " , me)}
                                <CopyToClipboard text={me} >
                                    <Button variant="contained" color="primary" fullWidth startIcon={<GoFile fontSize="small" />}>
                                        Copy Your ID 
                                    </Button>
                                </CopyToClipboard>
                            </Grid>
                            <Grid >
                                <Typography gutterBottom variant="h6">Make a call</Typography>
                                <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                                {callAccepted && !callEnded ? (
                                    <Button variant="contained" color="secondary" startIcon={<BiPhoneOff fontSize="large" />} fullWidth onClick={leaveCall} >
                                        Hang Up
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" startIcon={<AiFillPhone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)} >
                                        Call
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </form>
                    <Notifications />
                </Paper>
            </Container>
    );
};

export default Optionspg;