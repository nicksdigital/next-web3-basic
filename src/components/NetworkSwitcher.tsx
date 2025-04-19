import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ChainId } from '../types';

interface NetworkOption {
  chainId: number;
  name: string;
}

interface NetworkSwitcherProps {
  className?: string;
  networks?: NetworkOption[];
  onChange?: (chainId: number) => void;
}

const DEFAULT_NETWORKS: NetworkOption[] = [
  { chainId: ChainId.MAINNET, name: 'Ethereum' },
  { chainId: ChainId.POLYGON, name: 'Polygon' },
  { chainId: ChainId.ARBITRUM, name: 'Arbitrum' },
  { chainId: ChainId.OPTIMISM, name: 'Optimism' },
  { chainId: ChainId.BSC, name: 'Binance Smart Chain' },
  { chainId: ChainId.AVALANCHE, name: 'Avalanche' },
  { chainId: ChainId.BASE, name: 'Base' },
];

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  className = '',
  networks = DEFAULT_NETWORKS,
  onChange,
}) => {
  const { chainId, switchNetwork } = useWeb3();
  const [isChanging, setIsChanging] = React.useState(false);
  
  const currentChain = chainId ? Number(chainId) : null;

  const handleNetworkChange = async (chainId: number) => {
    setIsChanging(true);
    try {
      await switchNetwork(chainId);
      if (onChange) {
        onChange(chainId);
      }
    } catch (error) {
      console.error('Error switching network:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className={`network-switcher ${className}`}>
      <select
        value={currentChain || ''}
        onChange={(e) => handleNetworkChange(Number(e.target.value))}
        disabled={isChanging}
        className="network-select"
      >
        <option value="" disabled>
          {isChanging ? 'Switching...' : 'Select Network'}
        </option>
        {networks.map((network) => (
          <option key={network.chainId} value={network.chainId}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NetworkSwitcher;