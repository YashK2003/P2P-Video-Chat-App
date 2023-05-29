import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export const Closecall = () => {

    const navigate = useNavigate();

    return (<div className="App">
        <b>
          <center>
            <h1 style={{marginTop: "50%" , fontFamily: "inherit"}}>Call has ended</h1>
            <Button variant='contained' style={{marginTop: "5%",marginLeft: "0%",marginBottom: "10px",width:"80%", backgroundColor:"#DAF5FF", color:"black"}} onClick={() => { navigate("/home") }}> Go back  </Button>
          </center>
        </b>{" "}
      </div>);
}
