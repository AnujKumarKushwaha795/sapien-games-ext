import React from "react";
import "../styles/Menu.css";
import OpenEmailInputButton from "../authentication/OpenEmailInputButton";

const Menu = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`menu ${isOpen ? "open" : ""}`}>
        <header className="menu-header">
          <div className="menu-icon" onClick={onClose}>
            ⟪
          </div>
        </header>

        <div className="menu-items">
          <button className="menu-item active">FAQ</button>
          <button className="menu-item">Tagger Profile</button>
          <button className="menu-item">Points</button>
          <OpenEmailInputButton />
        </div>
      </div>
    </>
  );
};

export default Menu;