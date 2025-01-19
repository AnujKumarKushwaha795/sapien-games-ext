import React, { useState } from 'react';
import '../styles/Navbar.css';
import sapien_logo from '../assets/sapien_logo.png'; 
import menu_icon from '../assets/menu_icon.png'; 

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
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={sapien_logo} alt="Sapien" />
        </div>
        <div className={`menu-icon ${isMenuOpen ? 'rotate' : ''}`} onClick={toggleMenu}>
          <img src={menu_icon} alt="Menu" />
        </div>
      </nav>
      {(isMenuOpen || isAnimating) && (
        <div className={`menu-popup ${isMenuOpen ? 'open' : 'close'}`}>
          <div className="menu-links">
            <a href="/about">About Us</a>
            <a href="/how-it-works">How It Works</a>
            <a href="/faq">F.A.Q.</a>
            <a href="/blog" className="blog-link">/blog</a>
          </div>
        </div>
      )}
      {isMenuOpen && <div className="blur-background" onClick={toggleMenu}></div>}
    </>
  );
};

export default Navbar;