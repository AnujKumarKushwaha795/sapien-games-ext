import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import wootzappIcon from '../assets/wootzapp.png';

const Menu = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Check if WootzApp is available
      if (typeof window.wootzapp === 'undefined') {
        throw new Error('WootzApp wallet is not installed!');
      }

      // Request account access
      const accounts = await window.wootzapp.request({
        method: 'eth_requestAccounts',
        params: []
      });

      if (accounts && accounts.length > 0) {
        // Get the connected chain ID
        const chainId = await window.wootzapp.request({
          method: 'eth_chainId'
        });

        if (chainId) {
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', accounts[0]);
          localStorage.setItem('chainId', chainId);
          
          // Add a small delay for UI feedback
          await new Promise(resolve => setTimeout(resolve, 1000));
          navigate('/dashboard');
        }
      } else {
        throw new Error('No accounts found. Please check your wallet.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="menu">
      <header>
        <button className="back-button" onClick={handleBack}>←</button>
        <h1>Menu</h1>
      </header>
      
      <div className="menu-items">
        <button className="menu-item">FAQ</button>
        <button className="menu-item">Tagger Profile</button>
        <button className="menu-item">Points</button>
        <button className="menu-item">Sign In</button>
        <button className="menu-item wallet-connect" onClick={connectWallet} disabled={isLoading}>
          <img src={wootzappIcon} alt="WootzApp" className="wallet-icon" />
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      </div>

      {/* Loading Dialog */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <h3>Connecting...</h3>
            <p>Please wait while we're connecting with wallet...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;