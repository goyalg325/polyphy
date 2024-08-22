'use client';
import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import dynamic from 'next/dynamic';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

const Navlinks = dynamic(() => import('./Navlinks'), {
  loading: () => <p>Loading...</p>,
});

const Navbar = ({ categories, pagesByCategory }) => {
  const mobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar bg-black">
      {!mobile ? (
        <Navlinks dir="row" sp={4} categories={categories} pagesByCategory={pagesByCategory} />
      ) : !open ? (
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      ) : (
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      )}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            padding: "0.5rem 3rem",
            width: "100%", 
            height: "100vh", 
            backgroundColor: "black",
            marginTop: mobile ? "1rem" : "0",
            overflowY: "auto",
          }}
        >
          <div className="navbar">
            <Navlinks dir="column" sp={4} setOpen={setOpen} categories={categories} pagesByCategory={pagesByCategory} />
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default Navbar;
