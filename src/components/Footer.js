import { Box } from "@mui/system";
import React from "react";
import "./Footer.css";

const Footer = (props) => {
  return (
    <Box className="footer">
      <Box>
        <img src="logo_dark.svg" alt="QKart-icon"></img>
      </Box>
      <p className="footer-text">
        QKart is your one stop solution to the buy the latest trending items
        with India's Fastest Delivery to your doorstep
      </p>
      {props.alert.type && <div className={`alert alert-${props.alert.type}`} role="alert">
        {props.alert.msg}
      </div>}
    </Box>
  );
};

export default Footer;
