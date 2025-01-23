
import React, { useState } from "react";
import "../styles/EmailInput.css"; // Add this line to import the CSS

const EmailInput = ({ onOtpSent }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Initiating email verification for:", email);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Email validation failed");
      setError("Please enter a valid email address.");
      return;
    }

    try {
      console.log("Making API call to passwordless/init");
      const response = await fetch("https://auth.privy.io/api/v1/passwordless/init", {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "privy-app-id": "cm668wd7e0162w7562xb9xnhu",
          "privy-ca-id": "b63f2350-b686-4f70-894a-0d8f1f870592",
          "privy-client": "react-auth:1.98.4",
        },
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("Passwordless init API response:", result);

      if (result.success) {
        console.log("OTP initialization successful");
        onOtpSent(email);
      } else {
        console.log("OTP initialization failed:", result.error);
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("API call failed:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="email-input-container">
      <h5>Email Login</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Continue</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default EmailInput;