// components/Navlinks.js
'use client'
import React, { useState } from "react";
import { Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useMediaQuery } from "@mui/material";

const Navlinks = ({ dir, sp, setOpen }) => {
  const mobile = useMediaQuery("(max-width:768px)");
  const [open, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <Stack
      direction={dir}
      spacing={sp}
      alignItems={!mobile ? "center" : "left"}
    >
      <li>
        <a className="navLinksMain" href= {`${process.env.NEXT_PUBLIC_URL}/`}>
          Home
        </a>
      </li>
      <li>
        <a className="navLinksMain" href={`${process.env.NEXT_PUBLIC_URL}/story`}>
          Story
        </a>
      </li>
      <li>
        <a
          className="navLinksMain"
          href={"https://polyphy.readthedocs.io/"}
          target="_blank"
          rel="noreferrer"
        >
          Documentation
        </a>
      </li>
      <li className="dropdown-wrapper">
        <p className="navLinksMain">Gallery</p>
        <ul className="dropdown">
          <li>
            <a
              className="dropdown-links"
              href={`${process.env.NEXT_PUBLIC_URL}/research`}
            >
              Research
            </a>
          </li>
          <li>
            <a
              className="dropdown-links"
              href={`${process.env.NEXT_PUBLIC_URL}/creatives`}
            >
              Creative
            </a>
          </li>
          <li>
            <a
              className="dropdown-links"
              href={`${process.env.NEXT_PUBLIC_URL}/usecases`}
            >
              Usecases
            </a>
          </li>
          <li>
            <a
              className="dropdown-links"
              href={`${process.env.NEXT_PUBLIC_URL}/tutorials`}
            >
              Tutorials
            </a>
          </li>
        </ul>
      </li>
      <li className="dropdown-wrapper">
        <p className="navLinksMain">Community</p>
        <ul className="dropdown">
          <li>
            <a className="dropdown-links" href="https://github.com/PolyPhyHub">
              GitHub
            </a>
          </li>
          <li>
            <a
              className="dropdown-links"
              href={`${process.env.NEXT_PUBLIC_URL}/opportunities`}
            >
              Opportunities{" "}
            </a>
          </li>
          <li onClick={handleClickOpen}>
            <a className="dropdown-links">Slack </a>
          </li>
          <li>
            <a
              className="dropdown-links"
              href="https://github.com/PolyPhyHub/PolyPhy/issues"
            >
              Discussions
            </a>
          </li>
          <li>
            <a
              className="dropdown-links"
              href={`${process.env.NEXT_PUBLIC_URL}/team`}
            >
              Team
            </a>
          </li>
        </ul>
      </li>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Want to join PolyPhy's Slack Channel?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you want to interact with the developers of PolyPhy and know more
            about the software, feel free to request{" "}
            <a style={{ color: "#f7981b" }} href="mailto:oelek@ucsc.edu ">
              Dr. Oskar Elek
            </a>{" "}
            for the channel invitation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" href="mailto:oelek@ucsc.edu ">
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Navlinks;
