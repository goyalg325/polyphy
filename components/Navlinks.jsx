import React, { useEffect, useState } from "react";
import {
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import axios from "axios";

const Navlinks = ({ dir, sp, setOpen }) => {
  const mobile = useMediaQuery("(max-width:768px)");
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagesByCategory, setPagesByCategory] = useState({});

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPagesByCategory = async () => {
    try {
      const response = await axios.get("/api/page-by-category");
      console.log("Fetched pages by category:", response.data.data);
      setPagesByCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching pages by category:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPagesByCategory();
  }, []);

  return (
    <Stack
      direction={dir}
      spacing={sp}
      alignItems={!mobile ? "center" : "left"}
      component="ul"
    >
      <li>
        <a className="navLinksMain" href={`/`}>
          Home
        </a>
      </li>
      <li>
        <a className="navLinksMain" href={`/story`}>
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

      {categories.map((category) => (
        <li className="dropdown-wrapper" key={category}>
          <p className="navLinksMain">{category}</p>
          <ul className="dropdown">
            {pagesByCategory[category]?.map((page) => (
              <li key={page.title} className="w-full">
                <a
                  className="block text-ellipsis whitespace-nowrap overflow-hidden max-w-[150px]"
                  href={`/${page.title}`}
                  onClick={() => setOpen && setOpen(false)}
                >
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}

      <li className="dropdown-wrapper">
        <p className="navLinksMain">Community</p>
        <ul className="dropdown">
          <li>
            <a className="dropdown-links" href="https://github.com/PolyPhyHub">
              GitHub
            </a>
          </li>
          <li>
            <a className="dropdown-links" href={`/opportunities`}>
              Opportunities
            </a>
          </li>
          <li onClick={handleClickOpen}>
            <a className="dropdown-links">Slack</a>
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
            <a className="dropdown-links" href={`/team`}>
              Team
            </a>
          </li>
        </ul>
      </li>

      <li>
        <a className="navLinksMain" href={`/admin`}>
          Admin
        </a>
      </li>

      <Dialog open={openDialog} onClose={handleClose}>
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
