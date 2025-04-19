import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ChainId } from '../types';
import { ethers } from 'ethers';

interface WalletInfoProps {
  className?: string;
  showBalance?: boolean;
  showNetwork?: boolean;
  showAvatar?: boolean;
}

const NETWORK_NAMES: Record<number, string> = {
  [ChainId.MAINNET]: 'Ethereum Mainnet',
  [ChainId.GOERLI]: 'Goerli Testnet',
  [ChainId.SEPOLIA]: 'Sepolia Testnet',
  [ChainId.POLYGON]: 'Polygon Mainnet',
  [ChainId.POLYGON_MUMBAI]: 'Polygon Mumbai',
  [ChainId.ARBITRUM]: 'Arbitrum One',
  [ChainId.OPTIMISM]: 'Optimism',
  [ChainId.BSC]: 'Binance Smart Chain',
  [ChainId.AVALANCHE]: 'Avalanche C-Chain',
  [ChainId.BASE]: 'Base',
};

const WalletInfo: React.FC<WalletInfoProps> = ({
  className = '',
  showBalance = true,
  showNetwork = true,
  showAvatar = true,
}) => {
  const { account, chainId, provider } = useWeb3();
  const [balance, setBalance] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account && provider && showBalance) {
        setIsLoading(true);
        try {
          const balance = await provider.getBalance(account);
          // Format balance to ETH with 4 decimal places
          setBalance(Number(ethers.formatEther(balance)).toFixed(4));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBalance();
  }, [account, provider, showBalance]);

  if (!account) {
    return null;
  }

  const currentNetworkId = chainId ? Number(chainId) : null;
  const networkName = currentNetworkId ? (NETWORK_NAMES[currentNetworkId] || `Chain ID: ${currentNetworkId}`) : 'Unknown Network';

  return (
    <div className={`wallet-info ${className}`}>
      {showAvatar && (
        <div className="wallet-avatar">
          {/* Simple avatar based on the address */}
          <div 
            className="avatar-image" 
            style={{ 
              background: `#${account.slice(-6)}`,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              marginRight: '8px'
            }}
          />
        </div>
      )}
      
      <div className="wallet-details">
        <div className="wallet-address">
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </div>
        
        {showBalance && (
          <div className="wallet-balance">
            {isLoading ? 'Loading...' : (balance ? `${balance} ETH` : 'Balance unavailable')}
          </div>
        )}
        
        {showNetwork && (
          <div className="wallet-network">
            {networkName}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInfo;