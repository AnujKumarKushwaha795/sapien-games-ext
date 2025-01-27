/*global chrome*/
console.log('🚀 Content script loaded on:', window.location.href);

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