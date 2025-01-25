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

// This is the codebase, and this react app is for chrome-extension that I am making, so Solve or Implement my task/ aim/ goal.
//   Here is the flow:
//   At first the Hero page is opened in which there is a sigin button and will changed to PlayNow if user is logged in.
//   The signin button should open @https://app.sapien.io  this website in the chrome-extension itself in which user login or signup is happening, and we have to intercept the authentication api to get all the response and save it, also we have to save the cookies so that it is not required to signin again.
//   Now if the webpage authentication api is done, then the website should automatically close and it should redirect to the dashboard or our app (Dashboard.js) where the token is used to display image in vehicle postioning and play games.
//   And if the user is already logged in then on clicking the Playnow button it should directly open the dashboard with the old token.