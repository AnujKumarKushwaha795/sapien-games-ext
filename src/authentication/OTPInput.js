import React, { useState } from "react";
import "../styles/OTPInput.css"; // Add this line to import the CSS

const OTPInput = ({ email, onAuthComplete }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
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

      const result = await response.json();

      if (result.success) {
        onAuthComplete(result.token);
      } else {
        setError(result.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h4>Enter OTP</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Continue</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default OTPInput;