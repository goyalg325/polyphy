'use client';

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import dynamic from 'next/dynamic';
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';

const Navlinks = dynamic(() => import('./Navlinks'), {
  loading: () => <p>Loading...</p>,
});

const Navbar = () => {
  const mobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagesByCategory, setPagesByCategory] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log("Fetched categories:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPagesByCategory = async () => {
      try {
        const response = await axios.get(`/api/page-by-category?timestamp=${new Date().getTime()}`);
        console.log("Fetched pages by category:", response.data.data);
        setPagesByCategory(response.data.data);
      } catch (error) {
        console.error("Error fetching pages by category:", error);
      }
    };

    fetchPagesByCategory();
  }, []);

  return (
    <div className="navbar bg-black">
      {!mobile ? (
        <Navlinks
          dir="row"
          sp={4}
          categories={categories}
          pagesByCategory={pagesByCategory}
          setOpen={setOpen}
        />
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
            <Navlinks
              dir="column"
              sp={4}
              categories={categories}
              pagesByCategory={pagesByCategory}
              setOpen={setOpen}
            />
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default Navbar;
