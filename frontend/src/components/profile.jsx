import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import LoopCircleLoading from './loader'

function ProfilePage() {

  const navigate = useNavigate()

  const [User, setUser] = useState(null);
  const [isContactListVisible, setIsContactListVisible] = useState(false);

  useEffect(() => {
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
          setUser(res.data);

        })
        .catch(err => {
          console.log("error here is -->  ", JSON.stringify(err));
          // localStorage.removeItem("access-token");
          // (window.location.href = "/login")
        });
    }
  }, [User]);

  if (!User) {
    return <div className= "App"><LoopCircleLoading/></div>;
  }


  const user = {
    name: User.Name,
    username: User.Name,
    email: User.Email,
    mobile: User.Phoneno,
    location: User.Location,
    state: User.State,
    contry: User.Country,
    pincode: User.Pincode,
    proffesion: User.Proffesion,
    profilePicUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  };


  function func_video() {
    // video call implementation
    navigate("/lobby")
  }

  function func_message() {
    // message implementation
    navigate("/cl")
  }

  function func_logout() {
    // logout implementation
    localStorage.removeItem("access-token");
    navigate("/login")
  }


  // css for profile page i used inline css . 
  const styles = {
    profilePage: {
      maxWidth: '90%',
      margin: '0 auto',
      padding: '1rem',
      boxSizing: 'border-box',
      overflowY: 'auto',
    },
    profileHeader: {
      // alignItems: 'center',
      // gap: '1rem',
      overflowY: 'auto',
    },
    profilePic: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '100%',
      position: 'sticky',
      marginTop: '10px',
      border: '3px solid black',
      alignItems: 'center',
    },
    profileBody: {
      marginTop: '1rem',
    },
    contactList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: isContactListVisible ? 'block' : 'none',
    },
    actionButton: {
      padding: '0.5rem 1rem',
      fontSize: '1.2rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '1rem',
    },
    videoCallButton: {
      backgroundColor: '#ff5722',
      color: '#fff',
    },
    audioCallButton: {
      backgroundColor: '#3f51b5',
      color: '#fff',
    },
    messageButton: {
      backgroundColor: '#DAF5FF',
      color: 'Black',
    },
    logoutButton: {
      backgroundColor: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      marginTop: '2rem',
      top: '0px',
      textalign: 'center',
      textdecoration: 'none',
      display: 'inline-block',
      fontsize: '16px',
      margin: '4px 2px',
    }
  };

  return (
    // <>
    <div className="App">
      {/* main part of profile page */}
      <div style={styles.profilePage}>
        <div style={styles.profileHeader}>
          <img src={user.profilePicUrl} alt="Profile" style={styles.profilePic} /> <br />
          <h1>{user.name}</h1>
          <p style={{ display: 'flex' }}>Username:
            <Box sx={{ width: '100%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}> &nbsp;&nbsp;&nbsp;{user.username}</Box>
          </p>
          <p style={{ display: 'flex' }}>Email:
            <Box sx={{ float: 'right', width: '80%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}> &nbsp;&nbsp;&nbsp;{user.email}</Box>
          </p>
          <p style={{ display: 'flex' }}>Phoneno:
            <Box sx={{ float: 'right', width: '80%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}>
              &nbsp;&nbsp;&nbsp;{user.mobile}</Box>
          </p>
          <p style={{ display: 'flex' }}>Location:
            <Box sx={{ float: 'right', width: '80%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}>
              &nbsp;&nbsp;&nbsp;{user.location}</Box>
          </p>
          <p style={{ display: 'flex' }}>State:
            <Box sx={{ float: 'right', width: '80%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}>
              &nbsp;&nbsp;&nbsp;{user.state}</Box>
          </p>
          <p style={{ display: 'flex' }}>Country:
            <Box sx={{ float: 'right', width: '80%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}>
              &nbsp;&nbsp;&nbsp;{user.contry}</Box>
          </p>
          <p style={{ display: 'flex' }}>Pincode:
            <Box sx={{ float: 'right', width: '80%', marginLeft: '5%', alignItems: 'center', height: '25px', borderRadius: '5px', display: 'grid', bgcolor: 'grey.100', display: 'flex', color: 'black' }}>
              &nbsp;&nbsp;&nbsp;{user.pincode}</Box>
          </p>

          {/* <p>{user.location},{user.state},{user.contry},{user.pincode}</p> */}
          {/* <p>{user.state}</p>
        <p>{user.contry}</p>
        <p>{user.pincode}</p> */}
        </div>
        <div style={styles.profileBody}>
          <div className="profile-actions">

            <button style={{ ...styles.actionButton, ...styles.messageButton }} onClick={func_video}> Video Call</button>
            <button style={{ ...styles.actionButton, ...styles.messageButton }} onClick={func_message}> Chat</button>
            <br /><br />
            <button style={{ ...styles.actionButton, ...styles.videoCallButton }} onClick={func_logout}> Logout</button>

          </div>

        </div>
      </div>
    </div>
    // </>
  );
}

export default ProfilePage;
