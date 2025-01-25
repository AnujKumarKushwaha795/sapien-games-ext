/*global chrome*/
console.log('🚀 Content script loaded on:', window.location.href);

let interceptorInjected = false;

// Function to inject script with retry
function injectScript(retries = 3) {
    if (interceptorInjected) {
        console.log('⏭️ Interceptor already injected, skipping');
        return;
    }

    console.log('🔄 Attempting to inject interceptor script');
    try {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('interceptor.js');
        script.onload = () => {
            console.log('✅ Interceptor script loaded successfully');
            interceptorInjected = true;
            // Send message to background script
            chrome.runtime.sendMessage({
                type: 'INTERCEPTOR_LOADED',
                url: window.location.href
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('❌ Error notifying background:', chrome.runtime.lastError);
                } else {
                    console.log('✅ Background notified of interceptor load:', response);
                }
            });

            // Verify interceptor is working
            window.postMessage({ type: 'CHECK_INTERCEPTOR' }, '*');
        };
        script.onerror = (error) => {
            console.error('❌ Error loading interceptor script:', error);
            if (retries > 0) {
                console.log(`🔄 Retrying script injection... (${retries} attempts left)`);
                setTimeout(() => injectScript(retries - 1), 1000);
            }
        };
        (document.head || document.documentElement).appendChild(script);
        console.log('📥 Interceptor script injection attempted');
    } catch (error) {
        console.error('❌ Error injecting script:', error);
        if (retries > 0) {
            console.log(`🔄 Retrying script injection... (${retries} attempts left)`);
            setTimeout(() => injectScript(retries - 1), 1000);
        }
    }
}

// Listen for auth data from the interceptor
window.addEventListener('authDataCaptured', (event) => {
    console.log('🎉 Auth data captured:', {
        type: event.detail?.type,
        hasData: !!event.detail?.data,
        dataContent: event.detail?.data ? {
            hasToken: !!event.detail.data.token,
            hasPrivyToken: !!event.detail.data.privyAccessToken,
            hasRefreshToken: !!event.detail.data.refreshToken
        } : null
    });

    // Forward the event to the extension
    chrome.runtime.sendMessage({
        type: 'AUTH_DATA_CAPTURED',
        data: event.detail
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('❌ Error sending auth data to extension:', chrome.runtime.lastError);
        } else {
            console.log('✅ Auth data sent to extension:', response);
        }
    });

    // Broadcast to all extension views
    chrome.runtime.sendMessage({
        type: 'BROADCAST_AUTH_EVENT',
        data: event.detail
    });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 Content script received message:', message);
    
    if (message.type === 'CHECK_INTERCEPTOR') {
        sendResponse({ 
            injected: interceptorInjected,
            url: window.location.href
        });
    }
});

// Listen for interceptor verification
window.addEventListener('message', (event) => {
    if (event.data?.type === 'INTERCEPTOR_READY') {
        console.log('✅ Interceptor verified and ready');
        interceptorInjected = true;
    }
});

// Function to check if we should inject the interceptor
function shouldInjectInterceptor() {
    const url = window.location.href;
    return url.includes('auth.privy.io') || url.includes('app.sapien.io');
}

// Initial injection if needed
if (shouldInjectInterceptor()) {
    console.log('🎯 Matching URL detected, injecting interceptor');
    // Wait for document to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => injectScript());
    } else {
        injectScript();
    }
} else {
    console.log('⏭️ Skipping interceptor injection for:', window.location.href);
}

// Handle sign-in button click
document.addEventListener('click', function(event) {
    const signInButton = event.target.closest('[data-testid="sign-in-button"]');
    if (signInButton) {
        event.preventDefault();
        console.log('🔑 Sign in button clicked');
        
        // Notify extension to show login iframe
        chrome.runtime.sendMessage({
            type: 'SHOW_LOGIN_IFRAME'
        });
    }
}); 