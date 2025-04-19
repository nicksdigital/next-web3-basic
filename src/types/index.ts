import { ReactNode } from 'react';
import { ethers } from 'ethers';

export interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: bigint | null;
  isConnecting: boolean;
  error: Error | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

export interface Web3ProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  supportedChainIds?: number[];
}

export interface WithWeb3Options {
  autoConnect?: boolean;
  supportedChainIds?: number[];
  requiredChainId?: number;
  dappMetadata?: {
    name?: string;
    description?: string;
    url?: string;
    icons?: string[];
  };
  [key: string]: any;
}

export interface NetworkConfig {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
  SEPOLIA = 11155111,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  BSC = 56,
  AVALANCHE = 43114,
  BASE = 8453,
  // Add more chains as needed
}
