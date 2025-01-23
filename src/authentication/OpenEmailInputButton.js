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
    console.log("Opening email input form");
    setShowEmailInput(true);
  };

  const handleOtpSent = (email) => {
    console.log("handleOtpSent called with email:", email);
    setEmail(email);
    console.log("Email state updated");
    setShowOtpInput(true);
    console.log("OTP input form displayed");
    console.log("Current state - showEmailInput:", showEmailInput, "showOtpInput:", showOtpInput);
  };

  const handleAuthComplete = (token) => {
    console.log("Authentication completed with token length:", token?.length);
    setIsLoggedIn(true);
    setShowEmailInput(false);
    setShowOtpInput(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
  };

  console.log('Current component state:');
  console.log('showEmailInput:', showEmailInput);
  console.log('showOtpInput:', showOtpInput);
  console.log('email:', email);

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
            {showOtpInput ? (
              <OTPInput email={email} onAuthComplete={handleAuthComplete} />
            ) : (
              <EmailInput onOtpSent={handleOtpSent} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenEmailInputButton;