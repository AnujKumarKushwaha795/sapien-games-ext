import React from "react";
import { usePrivy } from "@privy-io/react-auth";

const ConnectWalletButton = () => {
  const { login, authenticated, logout } = usePrivy();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      {authenticated ? (
        <button onClick={handleLogout} className="wallet-button">
          Logout
        </button>
      ) : (
        <button onClick={handleLogin} className="wallet-button">
          Login with Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
