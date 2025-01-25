/*global chrome*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginFrame, setShowLoginFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuthStatus = async () => {
    console.log('🔍 Checking auth status...');
    try {
      // Check stored auth data
      const storagePromise = new Promise((resolve) => {
        chrome.storage.local.get(['authData', 'authToken', 'privyAccessToken'], (result) => {
          console.log('📦 Storage data:', {
            hasAuthData: !!result.authData,
            authDataContent: result.authData ? {
              hasToken: !!result.authData.token,
              hasPrivyToken: !!result.authData.privyAccessToken,
              hasRefreshToken: !!result.authData.refreshToken
            } : null,
            hasAuthToken: !!result.authToken,
            hasPrivyAccessToken: !!result.privyAccessToken
          });

          const hasValidAuth = !!(
            (result.authData?.token && result.authData?.privyAccessToken) || 
            (result.authToken && result.privyAccessToken)
          );
          resolve(hasValidAuth);
        });
      });

      const hasStoredAuth = await storagePromise;
      console.log('🔐 Auth status:', { hasStoredAuth });
      
      setIsLoggedIn(hasStoredAuth);

      if (hasStoredAuth) {
        console.log('🎮 User is authenticated, ready for dashboard');
      } else {
        console.log('🚫 User is not authenticated');
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setIsLoggedIn(false);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();

    // Listen for auth success message from the interceptor
    const handleAuthSuccess = async (event) => {
      console.log('🎉 Auth event received:', {
        type: event.detail?.type,
        hasData: !!event.detail?.data,
        dataContent: event.detail?.data ? {
          hasToken: !!event.detail.data.token,
          hasPrivyToken: !!event.detail.data.privyAccessToken,
          hasRefreshToken: !!event.detail.data.refreshToken
        } : null
      });
      
      if (event.detail?.type === 'AUTH_COMPLETE' && event.detail?.data) {
        const authData = event.detail.data;
        setIsLoading(true);
        
        try {
          console.log('💾 Saving auth data to storage:', {
            hasToken: !!authData.token,
            hasPrivyToken: !!authData.privyAccessToken,
            hasRefreshToken: !!authData.refreshToken
          });

          // Save complete auth response
          await new Promise((resolve, reject) => {
            chrome.storage.local.set({
              authData: authData,
              authToken: authData.token,
              privyAccessToken: authData.privyAccessToken,
              refreshToken: authData.refreshToken,
              lastLogin: new Date().toISOString()
            }, () => {
              if (chrome.runtime.lastError) {
                console.error('❌ Error saving auth data:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
              } else {
                console.log('✅ Auth data saved successfully');
                resolve();
              }
            });
          });
          
          // Verify storage
          chrome.storage.local.get(['authData', 'authToken', 'privyAccessToken'], (result) => {
            console.log('🔍 Verifying stored auth data:', {
              hasAuthData: !!result.authData,
              hasAuthToken: !!result.authToken,
              hasPrivyAccessToken: !!result.privyAccessToken
            });
          });
          
          // Recheck auth status
          await checkAuthStatus();
          
          // Close iframe and redirect
          console.log('🚀 Redirecting to dashboard...');
          setShowLoginFrame(false);
          navigate('/dashboard');
        } catch (error) {
          console.error('❌ Error handling auth success:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Add event listener for auth success
    window.addEventListener('authDataCaptured', handleAuthSuccess);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('authDataCaptured', handleAuthSuccess);
    };
  }, [navigate]);

  const handlePlayNow = async () => {
    console.log('🎮 Play Now clicked');
    // Double check auth before navigating
    await checkAuthStatus();
    if (isLoggedIn) {
      console.log('✅ User is logged in, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('🔑 User is not logged in, showing login frame');
      handleSignIn();
    }
  };

  const handleSignIn = () => {
    console.log('🔐 Opening login frame');
    setShowLoginFrame(true);
  };

  const handleCloseLogin = () => {
    console.log('🚪 Closing login frame');
    setShowLoginFrame(false);
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

        {showLoginFrame && (
          <div className="login-overlay">
            <div className="login-container">
              <button className="close-button" onClick={handleCloseLogin}>×</button>
              <iframe 
                src="https://app.sapien.io/"
                title="Sapien Login"
                className="login-frame"
                allow="scripts"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;