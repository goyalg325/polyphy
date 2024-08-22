import React from "react";
import { Stack } from "@mui/material";

const Navlinks = ({ dir, sp, setOpen, categories, pagesByCategory }) => {
  return (
    <Stack direction={dir} spacing={sp} alignItems="center">
      <li>
        <a className="navLinksMain" href={`/`}>Home</a>
      </li>
      <li>
        <a className="navLinksMain" href={`/story`}>Story</a>
      </li>
      <li>
        <a className="navLinksMain" href={"https://polyphy.readthedocs.io/"} target="_blank" rel="noreferrer">Documentation</a>
      </li>

      {/* Render categories and pages */}
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
            <a className="dropdown-links" href="https://github.com/PolyPhyHub">GitHub</a>
          </li>
          <li>
            <a className="dropdown-links" href={`/opportunities`}>Opportunities</a>
          </li>
          <li>
            <a className="dropdown-links" href={`/team`}>Team</a>
          </li>
        </ul>
      </li>

      <li>
        <a className="navLinksMain" href={`/admin`}>Admin</a>
      </li>
    </Stack>
  );
};

export default Navlinks;
