import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

const PrivyConfig = {
  embeddedWalletConfig: {
    preventPrivyInjection: false,  // Important for chrome extension
    customPrivyIframe: true,       // Use custom iframe handling
    requireHttps: false            // Allow non-HTTPS in development
  },
  appearance: {
    theme: 'light',
    accentColor: '#FF7033FF',
  }
};

const ExtensionProvider = ({ children }) => {
  return (
    <PrivyProvider
      appId="cm668wd7e0162w7562xb9xnhu" 
      config={PrivyConfig}
      onError={(error) => {
        console.error("Privy error:", error);
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default ExtensionProvider;
