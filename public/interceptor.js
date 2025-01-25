(function() {
    console.log('🎯 Auth Interceptor script injected');
    
    // Initialize requestData in window scope
    window.authData = {
        token: null,
        headers: null,
        cookies: null
    };

    // Function to send data to content script
    function sendToContentScript(data, type = 'AUTH_DATA') {
        console.log(`📤 Sending ${type} to content script:`, {
            dataType: type,
            hasToken: !!data.token,
            hasPrivyAccessToken: !!data.privyAccessToken,
            hasRefreshToken: !!data.refreshToken,
            hasResponse: !!data.response,
            hasHeaders: !!data.headers
        });
        
        window.dispatchEvent(new CustomEvent('authDataCaptured', {
            detail: {
                type: type,
                data: data
            }
        }));
    }

    // Function to parse and validate auth response
    function parseAuthResponse(responseText) {
        try {
            const responseData = JSON.parse(responseText);
            console.log('🔍 Parsing auth response:', {
                hasToken: !!responseData.token,
                hasPrivyAccessToken: !!responseData.privy_access_token,
                hasRefreshToken: !!responseData.refresh_token,
                hasUser: !!responseData.user
            });
            return responseData;
        } catch (e) {
            console.error('❌ Error parsing auth response:', e);
            console.log('📝 Raw response:', responseText);
            return null;
        }
    }

    // Listen for verification requests
    window.addEventListener('message', (event) => {
        if (event.data?.type === 'CHECK_INTERCEPTOR') {
            console.log('✅ Interceptor verification requested');
            window.postMessage({ type: 'INTERCEPTOR_READY' }, '*');
        }
    });

    // Capture XHR requests
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSetRequestHeader = xhr.setRequestHeader;
        const originalSend = xhr.send;
        let currentUrl = '';
        let allHeaders = {};
        let requestStartTime;

        xhr.open = function() {
            const method = arguments[0];
            const url = arguments[1];
            currentUrl = url;
            requestStartTime = Date.now();
            
            if (url && url.includes('auth.privy.io/api/v1/passwordless/authenticate')) {
                console.log('🎯 XHR Captured Auth URL:', url);
                console.log('⏱️ Request started at:', new Date(requestStartTime).toISOString());
                window.authData.url = url;
                window.authData.method = method;
            }
            return originalOpen.apply(this, arguments);
        };

        xhr.setRequestHeader = function(header, value) {
            if (currentUrl && currentUrl.includes('auth.privy.io/api/v1/passwordless/authenticate')) {
                allHeaders[header] = value;
                window.authData.headers = allHeaders;
                console.log(`🏷️ Setting auth header: ${header}`);
            }
            return originalSetRequestHeader.apply(this, arguments);
        };

        xhr.addEventListener('load', function() {
            if (currentUrl && currentUrl.includes('auth.privy.io/api/v1/passwordless/authenticate')) {
                const requestDuration = Date.now() - requestStartTime;
                console.log('⏱️ Auth request completed in:', requestDuration + 'ms');
                console.log('📊 Response status:', xhr.status);
                console.log('📊 Response headers:', xhr.getAllResponseHeaders());

                const responseData = parseAuthResponse(xhr.responseText);
                if (responseData) {
                    window.authData = {
                        ...window.authData,
                        response: responseData,
                        token: responseData.token,
                        privyAccessToken: responseData.privy_access_token,
                        refreshToken: responseData.refresh_token
                    };
                    
                    console.log('✅ Auth response captured:', {
                        status: xhr.status,
                        hasToken: !!responseData.token,
                        hasPrivyToken: !!responseData.privy_access_token,
                        hasRefreshToken: !!responseData.refresh_token
                    });
                    
                    sendToContentScript(window.authData, 'AUTH_COMPLETE');
                }
            }
        });

        xhr.addEventListener('error', function(error) {
            if (currentUrl && currentUrl.includes('auth.privy.io/api/v1/passwordless/authenticate')) {
                console.error('❌ XHR Error:', error);
                console.log('📊 Error status:', xhr.status);
                console.log('📝 Error response:', xhr.responseText);
            }
        });

        xhr.send = function(body) {
            if (currentUrl && currentUrl.includes('auth.privy.io/api/v1/passwordless/authenticate')) {
                try {
                    window.authData.body = body;
                    const parsedBody = body ? JSON.parse(body) : null;
                    console.log('📦 Sending auth request:', {
                        url: currentUrl,
                        method: window.authData.method,
                        headers: Object.keys(allHeaders),
                        hasBody: !!parsedBody
                    });
                } catch (e) {
                    console.error('❌ Error with auth request body:', e);
                }
            }
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // Also capture fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function(url, options = {}) {
        if (url && url.toString().includes('auth.privy.io/api/v1/passwordless/authenticate')) {
            console.log('🎯 Auth fetch request captured:', {
                url: url.toString(),
                method: options.method,
                hasBody: !!options.body,
                headers: options.headers ? Object.keys(options.headers) : []
            });
            
            try {
                const requestStartTime = Date.now();
                const response = await originalFetch.apply(this, arguments);
                const requestDuration = Date.now() - requestStartTime;
                console.log('⏱️ Auth fetch completed in:', requestDuration + 'ms');
                
                const responseClone = response.clone();
                const responseText = await responseClone.text();
                const responseData = parseAuthResponse(responseText);
                
                if (responseData) {
                    window.authData = {
                        url: url.toString(),
                        headers: options.headers,
                        response: responseData,
                        token: responseData.token,
                        privyAccessToken: responseData.privy_access_token,
                        refreshToken: responseData.refresh_token
                    };
                    
                    console.log('✅ Auth fetch response:', {
                        status: response.status,
                        hasToken: !!responseData.token,
                        hasPrivyToken: !!responseData.privy_access_token,
                        hasRefreshToken: !!responseData.refresh_token
                    });
                    
                    sendToContentScript(window.authData, 'AUTH_COMPLETE');
                }
                
                return response;
            } catch (e) {
                console.error('❌ Error handling auth fetch:', e);
                throw e;
            }
        }
        return originalFetch.apply(this, arguments);
    };

    console.log('✅ Auth interceptor setup complete');
    
    // Notify that interceptor is ready
    window.postMessage({ type: 'INTERCEPTOR_READY' }, '*');
})(); 