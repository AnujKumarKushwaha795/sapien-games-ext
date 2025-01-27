/*global chrome*/
console.log('🌟 Content script loaded on:', window.location.href);

// Function to inject the interceptor script
function injectInterceptor() {
    try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('interceptor.js');
        
        script.onload = () => {
            console.log('✅ Interceptor script loaded successfully');
            script.remove();
        };
        
        script.onerror = (error) => {
            console.error('❌ Failed to load interceptor script:', error);
        };
        
        (document.head || document.documentElement).appendChild(script);
    } catch (error) {
        console.error('❌ Error injecting interceptor:', error);
    }
}

// Function to redirect to extension dashboard
function redirectToExtension() {
    const extensionId = chrome.runtime.id;
    console.log('🚀 Redirecting to extension dashboard');
    window.location.href = `chrome-extension://${extensionId}/index.html#/dashboard`;
}

// Function to save auth data
async function saveAuthData(data) {
    console.log('💾 Saving auth data:', {
        hasToken: !!data.token,
        hasPrivyToken: !!data.privyAccessToken,
        hasRefreshToken: !!data.refreshToken,
        tokenLength: data.token?.length,
        privyTokenLength: data.privyAccessToken?.length
    });

    return new Promise((resolve, reject) => {
        const storageData = {
            authData: {
                token: data.token,
                privyAccessToken: data.privyAccessToken,
                refreshToken: data.refreshToken,
                user: data.user,
                timestamp: Date.now()
            }
        };

        console.log('📦 Storing data structure:', {
            hasAuthData: !!storageData.authData,
            authDataContent: {
                hasToken: !!storageData.authData.token,
                hasPrivyToken: !!storageData.authData.privyAccessToken,
                hasRefreshToken: !!storageData.authData.refreshToken,
                hasUser: !!storageData.authData.user,
                timestamp: storageData.authData.timestamp
            }
        });

        chrome.storage.local.set(storageData, () => {
            if (chrome.runtime.lastError) {
                console.error('❌ Error saving auth data:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                console.log('✅ Auth data saved successfully');
                // Verify the data was saved
                chrome.storage.local.get(['authData'], (result) => {
                    console.log('🔍 Verifying saved data:', {
                        hasAuthData: !!result.authData,
                        savedContent: {
                            hasToken: !!result.authData?.token,
                            hasPrivyToken: !!result.authData?.privyAccessToken,
                            timestamp: result.authData?.timestamp
                        }
                    });
                });
                resolve();
            }
        });
    });
}

// Listen for auth data from the interceptor
window.addEventListener('message', async function(event) {
    if (event.source !== window) return;
    
    const data = event.data;
    if (!data || !data.type) return;

    console.log('📨 Content script received message:', {
        type: data.type,
        hasToken: !!data.token,
        hasPrivyToken: !!data.privyAccessToken
    });

    // Handle successful authentication
    if (data.type === 'AUTH_COMPLETE' && (data.token || data.privyAccessToken)) {
        try {
            await saveAuthData(data);
            redirectToExtension();
        } catch (error) {
            console.error('❌ Error handling auth data:', error);
        }
    }
});

// Check if we're on the dashboard page after login
if (window.location.href.includes('app.sapien.io/dashboard') || 
    window.location.href.includes('app.sapien.io/t/dashboard')) {
    console.log('📍 Detected dashboard redirect, checking auth status');
    
    // Check if we have auth data
    chrome.storage.local.get(['authData'], (result) => {
        if (!result.authData?.token) {
            console.log('⚠️ No auth data found, attempting to capture from cookies');
            window.postMessage({ type: 'CHECK_COOKIES' }, '*');
        } else {
            console.log('✅ Auth data exists, redirecting to extension');
            redirectToExtension();
        }
    });
}

// Inject the interceptor if we're on Sapien
if (window.location.href.includes('app.sapien.io')) {
    console.log('🔍 On Sapien website, injecting interceptor');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectInterceptor);
    } else {
        injectInterceptor();
    }
}

// Handle sign-in button click
document.addEventListener('click', function(event) {
    const signInButton = event.target.closest('[data-testid="sign-in-button"]');
    if (signInButton) {
        event.preventDefault();
        console.log('🔑 Sign in button clicked');
        window.location.href = 'https://app.sapien.io/';
    }
}); 

// // Only run on app.sapien.io
// if (window.location.hostname === 'app.sapien.io') {
//   // Create and inject styles
//   const style = document.createElement('style');
//   style.textContent = `
//     .sapien-close-button {
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       width: 40px;
//       height: 40px;
//       background: none;
//       border: none;
//       color: #ff7033;
//       font-size: 24px;
//       cursor: pointer;
//       z-index: 10000;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       transition: transform 0.2s ease;
//       background: #2d3436;
//       border-radius: 50%;
//       box-shadow: 0 2px 10px rgba(255, 112, 51, 0.3);
//     }

//     .sapien-close-button:hover {
//       transform: scale(1.1);
//       box-shadow: 0 4px 15px rgba(255, 112, 51, 0.4);
//     }

//     .redirect-loading {
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: #505050c1;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       align-items: center;
//       gap: 20px;
//       z-index: 9999;
//     }

//     .redirect-loading::before {
//       content: "";
//       position: fixed;
//       top: 10px;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background: url('${chrome.runtime.getURL('assets/icon.png')}') no-repeat center center;
//       background-size: cover;
//       opacity: 0.35;
//       z-index: -1;
//     }

//     .redirect-spinner {
//       width: 40px;
//       height: 40px;
//       border: 3px solid #ff7033;
//       border-top-color: transparent;
//       border-radius: 50%;
//       animation: spinner 0.8s linear infinite;
//     }

//     .redirect-text {
//       color: #ff7033;
//       font-size: 18px;
//       font-weight: 500;
//     }

//     @keyframes spinner {
//       to {
//         transform: rotate(360deg);
//       }
//     }

//     body.loading {
//       visibility: hidden;
//     }
//   `;
//   document.head.appendChild(style);

//   // Hide the body initially
//   document.body.classList.add('loading');

//   // Create loading overlay
//   const loadingOverlay = document.createElement('div');
//   loadingOverlay.className = 'redirect-loading';
//   loadingOverlay.innerHTML = `
//     <div class="redirect-spinner"></div>
//     <div class="redirect-text">Redirecting to the Signin page</div>
//   `;
//   document.body.parentNode.insertBefore(loadingOverlay, document.body);

//   // After 2 seconds, show the page and remove the loading overlay
//   setTimeout(() => {
//     document.body.classList.remove('loading');
//     loadingOverlay.remove();
//   }, 2000);

//   // Create and add the close button
//   const closeButton = document.createElement('button');
//   closeButton.className = 'sapien-close-button';
//   closeButton.innerHTML = '✕';
//   closeButton.onclick = () => {
//     console.log('🔄 Returning to extension hero page');
//     const extensionId = chrome.runtime.id;
//     window.location.href = `chrome-extension://${extensionId}/index.html`;
//   };
//   document.body.appendChild(closeButton);
// } 