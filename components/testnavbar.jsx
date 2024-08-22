'use client'
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

const Navbar = () => {
  const mobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar bg-black">
      {!mobile ? (
        <Navlinks dir="row" sp={4} />
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
      width: "100%", // Adjusted drawer width for mobile view
      height: "100vh", // Set height to full viewport height
      backgroundColor: "black",
      marginTop: mobile ? "1rem" : "0",
      overflowY: "auto", // Make the drawer scrollable when content exceeds height
    }}
  >
    <div className="navbar">
      <Navlinks dir="column" sp={4} setOpen={setOpen} />
    </div>
  </Box>
</Drawer>


    </div>
  );
};

export default Navbar;
