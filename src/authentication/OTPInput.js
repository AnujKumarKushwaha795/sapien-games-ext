/* global chrome */
import React, { useState } from "react";
import "../styles/OTPInput.css"; // Add this line to import the CSS

const OTPInput = ({ email, onAuthComplete }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    console.log('OTPInput handleSubmit called');
    e.preventDefault();
    setError("");
    console.log('OTPInput handleSubmit called with email:', email);
    console.log('OTPInput handleSubmit called with otp:', otp);

    try {
      console.log('authenticating...');
      const response = await fetch("https://auth.privy.io/api/v1/passwordless/authenticate", {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "privy-app-id": "cm668wd7e0162w7562xb9xnhu",
          "privy-ca-id": "b63f2350-b686-4f70-894a-0d8f1f870592",
          "privy-client": "react-auth:1.98.4",
        },
        method: "POST",
        body: JSON.stringify({ email, code: otp, mode: "login-or-sign-up" }),
      });
      console.log("Raw Response:", response);
      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Full authentication response:", result);
      
      if (result.token) {
        console.log("Authentication successful!");
        console.log("User ID:", result.user.id);
        console.log("User email:", result.user.linked_accounts.find(acc => acc.type === 'email')?.address);
        
        // Save relevant data to chrome.storage
        chrome.storage.local.set({
          authToken: result.token,
          privyAccessToken: result.privy_access_token,
          refreshToken: result.refresh_token,
          userId: result.user.id,
          userEmail: result.user.linked_accounts.find(acc => acc.type === 'email')?.address
        }, () => {
          console.log('Auth data saved to chrome.storage with:');
          console.log('- Auth Token:', result.token);
          console.log('- Privy Access Token:', result.privy_access_token);
          console.log('- User ID:', result.user.id);
        });
        console.log('Auth data saved to chrome.storage');
        // check if auth data is saved
        console.log('Checking if auth data is saved...');
        chrome.storage.local.get(['authToken'], function(result) {
          console.log('Auth data retrieved from chrome.storage:', result);
        });
        
        onAuthComplete(result.token);
        console.log("Authentication flow complete!");
      } else {
        console.error("Authentication failed:", result.error || result.message);
        setError(result.error || result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="otp-input-container">
      <h4>Enter OTP</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default OTPInput;