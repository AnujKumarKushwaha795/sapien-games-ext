/*global chrome*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuthStatus = async () => {
    console.log('🔍 Checking auth status...');
    try {
      const result = await new Promise((resolve) => {
        chrome.storage.local.get(['authData'], (result) => {
          console.log('📦 Storage data:', {
            hasAuthData: !!result.authData,
            authDataContent: result.authData ? {
              hasToken: !!result.authData.token,
              hasPrivyToken: !!result.authData.privyAccessToken,
              timestamp: result.authData.timestamp
            } : null
          });
          resolve(result);
        });
      });

      const hasValidAuth = !!(result.authData?.token && result.authData?.privyAccessToken);
      console.log('🔐 Auth status:', { hasValidAuth });
      
      setIsLoggedIn(hasValidAuth);
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handlePlayNow = async () => {
    console.log('🎮 Play Now clicked');
    if (isLoggedIn) {
      console.log('✅ User is logged in, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('🔑 User is not logged in, redirecting to Sapien login');
      window.location.href = 'https://app.sapien.io/';
    }
  };

  if (isLoading) {
    return (
      <div className="hero">
        <div className="content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero">
      <div className="content">
        <div className="hero-text">
          <h1 className="gradient-text">Play. Earn.<br/>Train AI.</h1>
          <p>Join thousands of players contributing to AI through fun, rewarding tasks—right from your phone!</p>
        </div>

        <button 
          className="cta-button orange-button" 
          onClick={handlePlayNow}
          data-testid="sign-in-button"
        >
          {isLoggedIn ? 'Play Now!' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default Hero;
