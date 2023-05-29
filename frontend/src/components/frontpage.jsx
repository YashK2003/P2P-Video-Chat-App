import React from 'react';
import { useNavigate } from 'react-router-dom';
// import image from './homepageutils/images.jpeg';
import { Button } from '@mui/material';
import axios from "axios";

const divstyle = {

  margin: "auto",
  align: "center",
  marginTop: "40%",
  height: "45%",
  color: "white",
  width: "90%",
  backgroundColor: "#DAF5FF",
  fontFamily: "Arial",
  borderRadius: "30px"
};


const FrontPage = () => {
  const history = useNavigate();

  const jwt = localStorage.getItem("access-token");
  if (!jwt) {
    history('/login');
  } else {
    // console.log(process.env.REACT_APP_IP);
    let st1 = process.env.REACT_APP_IP;
    let st2 = "/auth";
    let result = st1.concat(st2);
    //     console.log(result);
    axios
      .get(result, {
        headers: { authorization: `Bearer: ${jwt}` }
      })
      .then(res => {
        console.log("VERIFIED USER");
        history('/home');
      })
      .catch(err => {
        console.log("error here is -->  ", JSON.stringify(err));
        localStorage.removeItem("access-token");
        history('/login');
      });
  }

  const handleSignIn = () => {
    history('/login');
  };

  const handleSignUp = () => {
    history('/register');
  };

  return (
    <div className="App">
      <div className="front-page">
        <h1 style={{ textAlign: "center", fontFamily: 'Caveat', marginTop: "50%" }}>P2P APP </h1>
        <div style={divstyle}>
          <br />
          <h3 style={{ textAlign: "center", color: "black", fontFamily: 'MV Boli' }}>Welcome to our P2P App !!</h3>
          <h3 style={{ textAlign: "center", color: "black", fontFamily: 'MV Boli' }}>Get started here with your account</h3>
          <div align="center" className="front-page__buttons">
            <Button variant='contained' style={{ width: "80%", backgroundColor: "#2192FF", color: "white" }} onClick={() => { handleSignUp() }}>Sign up</Button>
            <br /><br />
            <Button variant='contained' style={{ width: "80%", backgroundColor: "#2192FF", color: "white" }} onClick={() => { handleSignIn() }}>Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
