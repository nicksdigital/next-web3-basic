import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import type { Web3ContextType, Web3ProviderProps } from '../types';

// Create context with a default value that matches the shape
const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ 
  children,
  autoConnect = false,
  supportedChainIds = []
}: Web3ProviderProps) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize provider from window.ethereum
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Create ethers provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          
          // Get network
          const network = await provider.getNetwork();
          setChainId(network.chainId);
          
          // Check if already connected
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setSigner(await provider.getSigner());
          } else if (autoConnect) {
            // Auto connect if enabled
            connectWallet();
          }
        } catch (error) {
          console.error('Error initializing web3:', error);
          setError(error instanceof Error ? error : new Error('Unknown error initializing web3'));
        }
      }
    };
    
    initProvider();
  }, [autoConnect]);

  // Handle account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setAccount(null);
          setSigner(null);
        } else if (accounts[0] !== account) {
          // Account changed
          setAccount(accounts[0]);
          if (provider) {
            setSigner(await provider.getSigner());
          }
        }
      };
      
      const handleChainChanged = (_chainIdHex: string) => {
        // Chain changed, reload the page
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, provider]);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsConnecting(true);
      setError(null);
      
      try {
        // Request accounts
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        }) as string[];
        
        // Update state
        setAccount(accounts[0]);
        
        // Get signer
        if (provider) {
          setSigner(await provider.getSigner());
        }
        
        // Check if on supported chain
        if (supportedChainIds.length > 0 && provider) {
          const network = await provider.getNetwork();
          const currentChainId = Number(network.chainId);
          
          if (!supportedChainIds.includes(currentChainId)) {
            setError(new Error(`Please connect to a supported network. Supported chain IDs: ${supportedChainIds.join(', ')}`));
          }
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError(error instanceof Error ? error : new Error('Unknown error connecting wallet'));
      } finally {
        setIsConnecting(false);
      }
    } else {
      setError(new Error('No Ethereum wallet found. Please install MetaMask.'));
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
  };

  // Switch network function
  const switchNetwork = async (chainId: number) => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (switchError) {
        const error = switchError as { code: number; message: string };
        
        // This error code indicates that the chain has not been added to MetaMask
        if (error.code === 4902) {
          setError(new Error(`Chain with ID ${chainId} not added to wallet. Add it manually or use addNetwork() with chain details.`));
        } else {
          console.error('Error switching network:', error);
          setError(new Error(`Error switching network: ${error.message}`));
        }
      }
    }
  };

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3(): Web3ContextType {
  const context = useContext(Web3Context);
  if (context === null) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

export default Web3Context;