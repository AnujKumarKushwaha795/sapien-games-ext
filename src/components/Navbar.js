import React, { useState } from "react";
import "../styles/Navbar.css";
import sapien_logo from "../assets/sapien_logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimating(false);
      }, 500); // Match the animation duration
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={sapien_logo} alt="Sapien" className="logo-image" />
      </div>
    </nav>
  );
};

export default Navbar;
