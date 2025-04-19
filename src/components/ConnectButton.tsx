import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

interface ConnectButtonProps {
  className?: string;
  connectText?: string;
  disconnectText?: string;
  loadingText?: string;
  showAddress?: boolean;
  truncateAddress?: boolean;
  truncateLength?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const truncateAccount = (account: string, start = 6, end = 4): string => {
  if (!account) return '';
  return `${account.slice(0, start)}...${account.slice(-end)}`;
};

const ConnectButton: React.FC<ConnectButtonProps> = ({
  className = '',
  connectText = 'Connect Wallet',
  disconnectText = 'Disconnect',
  loadingText = 'Connecting...',
  showAddress = true,
  truncateAddress = true,
  truncateLength = 6,
  onConnect,
  onDisconnect
}) => {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWeb3();

  const handleConnect = async () => {
    await connectWallet();
    if (onConnect) onConnect();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    if (onDisconnect) onDisconnect();
  };

  // If connected and showing address
  if (account && showAddress) {
    return (
      <div className={`web3-connect-button connected ${className}`}>
        <span className="web3-address">
          {truncateAddress ? truncateAccount(account, truncateLength, truncateLength) : account}
        </span>
        <button
          onClick={handleDisconnect}
          className="web3-disconnect-btn"
          disabled={isConnecting}
        >
          {disconnectText}
        </button>
      </div>
    );
  }
  
  // Standard button (either connected without showing address, or not connected)
  return (
    <button
      className={`web3-connect-button ${account ? 'connected' : 'disconnected'} ${className}`}
      onClick={account ? handleDisconnect : handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? loadingText : (account ? disconnectText : connectText)}
    </button>
  );
};

export default ConnectButton;