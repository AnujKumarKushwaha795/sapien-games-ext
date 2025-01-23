import React, { useState } from "react";
import EmailInput from "./EmailInput";
import OTPInput from "./OTPInput";
import "../styles/OpenEmailInputButton.css"; // Add this line to import the CSS

const OpenEmailInputButton = () => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOpenEmailInput = () => {
    setShowEmailInput(true);
  };

  const handleOtpSent = (email) => {
    console.log("OTP sent to:", email);
    setEmail(email);
    setShowOtpInput(true);
  };

  const handleAuthComplete = (token) => {
    console.log("Authentication complete with token:", token);
    setIsLoggedIn(true);
    setShowEmailInput(false);
    setShowOtpInput(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
  };

  return (
    <div>
      {!isLoggedIn ? (
        <button className="login-signup-button" onClick={handleOpenEmailInput}>
          Login/Signup
        </button>
      ) : (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
      {(showEmailInput || showOtpInput) && (
        <div className={`slide-up-popup ${showEmailInput || showOtpInput ? "open" : ""}`}>
          <div className="popup-content">
            {showEmailInput && !showOtpInput && <EmailInput onOtpSent={handleOtpSent} />}
            {showOtpInput && <OTPInput email={email} onAuthComplete={handleAuthComplete} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenEmailInputButton;