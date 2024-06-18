'use client'
import React from "react";
import PropTypes from "prop-types";

const ButtonSwipe = ({ link, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = link; // Navigate to the link
  };

  return (
    <a href={link} onClick={handleClick} >
      <div className="button-swipe-wrapper">
      <div className="btn btn-1 hover-filled-slide-down">
        <span>{children}</span>
      </div>
      </div>
    </a>
  );
};

ButtonSwipe.propTypes = {
  link: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ButtonSwipe;

