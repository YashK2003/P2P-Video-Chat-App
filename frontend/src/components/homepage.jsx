import React from 'react';
import { CarouselProvider, Slider, Slide, DotGroup } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import styled from "styled-components";
import { ButtonBack, ButtonNext } from "pure-react-carousel";
import Arrow from "./homepageutils/arrow.svg";
import axios from 'axios'
import { AiOutlineMessage } from "react-icons/ai";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { TiUserOutline } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { BiPhoneCall } from "react-icons/bi";


const slidestyle = {
  margin: "auto",
  height: "90%",
  color: "white",
  width: "90%",
  backgroundColor: "#87CEEB",
  fontFamily: "Arial",
  borderRadius: "30px"
}

export const Homepage = () => {

  const jwt = localStorage.getItem("access-token");
  if (!jwt) {
    (window.location.href = "/login")
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
      })
      .catch(err => {
        console.log("error here is -->  ", JSON.stringify(err));
        localStorage.removeItem("access-token");
        (window.location.href = "/login")
      });
  }
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1 style={{ textAlign: "center", fontFamily: 'Caveat' }}>P2P APP </h1>
      <CarouselProvider
        naturalSlideWidth={80}
        naturalSlideHeight={80}
        totalSlides={3}
      >

        <Slider  >
          <Slide index={0} >
            <div style={slidestyle}>
              <br />
              <div style={{ color: "black", marginLeft: "10%", alignContent: "center", marginRight: "10%" }}>
                <h1>One platform to connect</h1>
                <h3>Chat together, peer to peer, end to end</h3>
              </div>
            </div>
          </Slide>

          <Slide index={1} >
            <div style={slidestyle}>
              <br />
              <div style={{ color: "black", marginLeft: "10%", alignContent: "center", marginRight: "10%" }}>
                <h1>Unified Communication & Collaboration problem</h1>
                <h3>Make meaningful connections with meetings, chatting, phone and more in one offering</h3>
              </div>
            </div>
          </Slide>

          <Slide index={2}>
            <div style={slidestyle}>
              <br />
              <div style={{ color: "black", marginLeft: "10%", alignContent: "center", marginRight: "10%" }}>
                <h1>Privacy First</h1>
                <h3>The data is secure and private at all times</h3>
              </div>
            </div>
          </Slide>

        </Slider>

        <Wrapper style={{ marginBottom: "150px" }} >
          <div className="controls">
            <ButtonBack className="btn-arrow reverse-arrow">
              <img src={Arrow} alt="arrow" />
            </ButtonBack>
            <DotGroup className="dot-group" />
            <ButtonNext className="btn-arrow">
              <img src={Arrow} alt="arrow" />
            </ButtonNext>
          </div>
          <div style={{ marginTop: "17%" }}>
        
            <button
              style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "4.95%" }}>
              <AiFillHome /></button>

            <button
              style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "4.95%" }} onClick={() => { navigate("/cl") }}>
              <AiOutlineMessage /></button>

            <button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "4.95%" }} onClick={() => { navigate("/lobby") }}>
              <AiOutlineVideoCamera /></button>

            <button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "35px", marginLeft: "4.95%" }} onClick={() => { navigate("/audcall") }}>
              <BiPhoneCall /></button>
            
            <button style={{ color: "white", borderStyle: "unset", backgroundColor: "transparent", fontSize: "40px", marginLeft: "4.95%" }} onClick={() => { navigate("/profile") }}>
              <TiUserOutline /></button>



          </div>
        </Wrapper>
      </CarouselProvider>
    </div>
  )

}


const Wrapper = styled.div`
  .controls {
    
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-arrow {
      border: none;
      background: none;
      padding: 11px 20px;
    }

    .reverse-arrow {
      transform: rotateY(180deg);
    }

    .dot-group {
      display: flex;
      align-items: center;
      justify-content: center;


      .carousel__dot {
        width: 8px;
        height: 8px;
        border: none;
        border-radius: 50%;
        margin: 0 4px;
        padding: 0;
        background-color: #FFFFFF;
      }

      /* This class is found in DotGroup from pure-react-carousel */
      /* We need to override it to add our styles */
      .carousel__dot--selected {
        width: 16px;
        height: 8px;
        border-radius: 10px;
        background-color: #87CEEB;
        transition: background 0.4s ease;
      }
    }
  }
`;
