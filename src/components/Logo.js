import React from 'react';
import { Box } from '@mui/material';
import logo from "../assets/Icon.png";
const ContactBox = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
    <img
      src={logo} // Replace with the path to your logo
      alt="Logo"
      style={{ width: "300px", height: "auto" }}
    />
  </Box>
  );
};

export default ContactBox;