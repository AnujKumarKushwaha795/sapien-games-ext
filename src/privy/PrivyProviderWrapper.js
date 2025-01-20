import { PrivyProvider } from '@privy-io/react-auth';
import ConnectWallet from './ConnectWallet';
function App() {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm65f2qak01x3vec0wd61yi6e'}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        supportedChains: [
          { id: 1, name: 'Ethereum' },
          { id: 137, name: 'Polygon' }
        ]
      }}
    >
      {/* Your app components */}
      <ConnectWallet />
    </PrivyProvider>
  );
}

export default App;