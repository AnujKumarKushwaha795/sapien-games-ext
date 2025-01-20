import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sapienLogo from '../assets/sapien_logo.png';
import wootzappIcon from '../assets/wootzapp.png';

const WalletConnect = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  useEffect(() => {
    // Check if already connected
    const checkWalletConnection = async () => {
      const wasDisconnected = !localStorage.getItem('walletConnected');
      if (wasDisconnected) {
        return;
      }

      // Check for WootzApp wallet
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
            params: []
          });

          if (accounts && accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId'
            });

            if (chainId) {
              localStorage.setItem('walletConnected', 'true');
              localStorage.setItem('walletAddress', accounts[0]);
              localStorage.setItem('chainId', chainId);
              navigate('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
          localStorage.removeItem('chainId');
        }
      }
    };

    checkWalletConnection();
  }, [navigate]);

  const connectWallet = async (walletType) => {
    setShowWalletPopup(false);
    setIsLoading(true);

    try {
      if (walletType === 'wootzapp') {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('WootzApp wallet is not installed!');
        }

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: []
        });

        if (accounts && accounts.length > 0) {
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          });

          if (chainId) {
            localStorage.setItem('walletConnected', 'true');
            localStorage.setItem('walletAddress', accounts[0]);
            localStorage.setItem('chainId', chainId);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigate('/dashboard');
          }
        } else {
          throw new Error('No accounts found. Please check your wallet.');
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add wallet selection popup JSX
  const WalletPopup = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl w-[280px] mx-auto border border-red-50">
        <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-[#ff4b2b] to-[#ff8c42] text-transparent bg-clip-text">
          Select Wallet
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => connectWallet('wootzapp')}
            className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-red-100"
          >
            <img
              src={wootzappIcon}
              alt="WootzApp"
              className="w-6 h-6"
            />
            <span className="font-medium">Wootzapp Wallet</span>
          </button>
          <button
            onClick={() => setShowWalletPopup(false)}
            className="w-full py-2 text-gray-600 hover:bg-red-50 rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Update return JSX
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fff5f5] via-[#fff0ed] to-[#fff5f2] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-red-50">
        <div className="flex flex-col items-center justify-center w-full">
          <img
            src={sapienLogo}
            alt="Sapien Logo"
            className="w-16 h-16 mb-6 drop-shadow-lg"
          />

          <h1 className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-[#ff8c42] via-[#ff9b5a] to-[#ffaa72] text-transparent bg-clip-text">
            Welcome to Sapien Games
          </h1>

          <p className="text-base text-gray-600 mb-10 text-center">
            Connect your wallet to get started
          </p>

          <button
            onClick={() => setShowWalletPopup(true)}
            disabled={isLoading}
            className="w-full bg-[#ff8c42] text-white py-3 rounded-lg font-medium text-base hover:bg-[#ff7c32] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>

      {/* Wallet Selection Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-[280px] mx-auto border border-red-50">
            <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-[#ff4b2b] to-[#ff8c42] text-transparent bg-clip-text">
              Select Wallet
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => connectWallet('wootzapp')}
                className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-red-100"
              >
                <img
                  src={wootzappIcon}
                  alt="WootzApp"
                  className="w-6 h-6"
                />
                <span className="font-medium">Wootzapp Wallet</span>
              </button>
              <button
                onClick={() => setShowWalletPopup(false)}
                className="w-full py-2 text-gray-600 hover:bg-red-50 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Dialog */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[280px] mx-auto border border-red-50">
            <h3 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-[#ff4b2b] to-[#ff8c42] text-transparent bg-clip-text">
              Connecting...
            </h3>
            <div className="text-center text-sm text-gray-600">
              Please wait while we're connecting with wallet...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;