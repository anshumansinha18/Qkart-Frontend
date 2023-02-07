import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  

  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload()
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const handleRegister = () => {
    history.push("/register");
  };

  const handleExplore = ()=>{
    history.push("/");
  }
  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {/* <Stack direction="row" spacing={2} justifyContent="flex-end">
          {b}
        </Stack> */}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variation="text"
          onClick={handleExplore}
        >
          BACK TO EXPLORE
        </Button>
      ) : localStorage.getItem("username") ? (
        <>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <div class="avatar">
              <img src="avatar.png" alt={localStorage.getItem("username")}></img>
              <span className="userName">{localStorage.getItem("username")}</span>
            </div>
            <Button
              variant="text"
              onClick={() => {
                handleLogOut();
              }}
            >
              LOGOUT
            </Button>
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" onClick={handleLogin}>
            LOGIN
          </Button>
          <Button variant="contained" onClick={handleRegister}>
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
