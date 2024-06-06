'use client'
// components/Navbar.js
import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import dynamic from 'next/dynamic';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

// Dynamically import the Navlinks component for code splitting and improved performance
const Navlinks = dynamic(() => import('./Navlinks'), {
  loading: () => <p>Loading...</p>,
});

// The Navbar component which manages the state and rendering logic for the navigation bar
const Navbar = () => {
  const mobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar">
      {!mobile ? (
        // Render Navlinks component in a row direction if not on a mobile device
        <Navlinks dir="row" sp={10} />
      ) : !open ? (
        // If on a mobile device and the drawer is not open, render the menu icon button
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      ) : (
        // If on a mobile device and the drawer is open, render the close icon button
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      )}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            padding: "1rem 3rem",
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
            marginTop: mobile ? "3rem" : "0",
          }}
        >
          <div className="navbar">
            <Navlinks dir="column" sp={5} setOpen={setOpen} />
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default Navbar;
