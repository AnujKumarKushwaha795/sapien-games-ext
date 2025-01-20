import { usePrivy } from '@privy-io/react-auth';

const ConnectWallet = () => {
  const { login, ready, authenticated, user } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <button 
      onClick={login}
      className="menu-item"
    >
      {authenticated 
        ? `${user?.wallet?.address?.slice(0, 6)}...${user?.wallet?.address?.slice(-4)}`
        : 'Connect Wallet'
      }
    </button>
  );
};

export default ConnectWallet;