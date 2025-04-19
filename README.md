# next-web3-basic

A lightweight, TypeScript-based Ethereum wallet integration plugin for Next.js 15+.

## Features

- 🔌 Simple Web3 wallet connection with MetaMask and other injected providers
- 🔄 Chain switching and network detection
- 🔒 TypeScript support with proper types
- 🧩 Pre-built components for common Web3 UI elements
- 🛠️ Built for Next.js 15+ and Node.js 20+
- 💼 Compatible with ethers.js v6

## Installation

```bash
npm install next-web3-basic ethers
# or
yarn add next-web3-basic ethers
# or
pnpm add next-web3-basic ethers
```

## Setup

### 1. Update your Next.js config

```typescript
// next.config.js or next.config.mjs
import withWeb3Basic from 'next-web3-basic';
// Or for CommonJS
// const { default: withWeb3Basic } = require('next-web3-basic');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
};

// Basic usage
export default withWeb3Basic(nextConfig);

// With options
export default withWeb3Basic(nextConfig, {
  autoConnect: false,
  supportedChainIds: [1, 137, 42161], // Mainnet, Polygon, Arbitrum
  requiredChainId: 1, // Require Ethereum Mainnet
  dappMetadata: {
    name: 'My Dapp',
    description: 'A decentralized application',
    url: 'https://mydapp.com',
    icons: ['https://mydapp.com/icon.png'],
  }
});
```

### 2. Wrap your app with the Web3Provider

```tsx
// pages/_app.tsx or app/layout.tsx
import { Web3Provider } from 'next-web3-basic';

export default function App({ Component, pageProps }) {
  return (
    <Web3Provider 
      autoConnect={false} 
      supportedChainIds={[1, 137, 42161]}
    >
      <Component {...pageProps} />
    </Web3Provider>
  );
}
```

## Usage

### Connect Button

```tsx
import { ConnectButton } from 'next-web3-basic';

export default function Home() {
  return (
    <div>
      <h1>My Dapp</h1>
      <ConnectButton 
        connectText="Connect Wallet"
        disconnectText="Disconnect"
        showAddress={true}
      />
    </div>
  );
}
```

### Network Switcher

```tsx
import { NetworkSwitcher } from 'next-web3-basic';

export default function NetworkSelector() {
  return (
    <div>
      <h2>Select Network</h2>
      <NetworkSwitcher 
        networks={[
          { chainId: 1, name: 'Ethereum' },
          { chainId: 137, name: 'Polygon' },
          { chainId: 42161, name: 'Arbitrum' }
        ]}
        onChange={(chainId) => console.log(`Switched to chainId: ${chainId}`)}
      />
    </div>
  );
}
```

### Wallet Info

```tsx
import { WalletInfo } from 'next-web3-basic';

export default function WalletDetails() {
  return (
    <div>
      <h2>Your Wallet</h2>
      <WalletInfo 
        showBalance={true}
        showNetwork={true}
        showAvatar={true}
      />
    </div>
  );
}
```

### Using the Web3 Hook

```tsx
import { useWeb3 } from 'next-web3-basic';
import { ethers } from 'ethers';

export default function SendTransaction() {
  const { signer, account } = useWeb3();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  
  const sendTransaction = async () => {
    if (!signer || !account) return;
    
    try {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      });
      
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };
  
  return (
    <div>
      <h2>Send ETH</h2>
      <input 
        type="text" 
        placeholder="Recipient Address" 
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Amount (ETH)" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction} disabled={!signer}>
        Send
      </button>
    </div>
  );
}
```

## Advanced Usage

### Check Connection Status

```tsx
import { useWeb3 } from 'next-web3-basic';

export default function ConnectionStatus() {
  const { account, chainId, error } = useWeb3();
  
  return (
    <div>
      <h2>Connection Status</h2>
      <p>Connected: {account ? 'Yes' : 'No'}</p>
      {account && <p>Account: {account}</p>}
      {chainId && <p>Chain ID: {chainId.toString()}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Protected Routes

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWeb3 } from 'next-web3-basic';

export default function ProtectedPage() {
  const { account, isConnecting } = useWeb3();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not connected and not currently connecting
    if (!account && !isConnecting) {
      router.push('/login');
    }
  }, [account, isConnecting, router]);
  
  if (!account) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {account}</p>
      {/* Protected content here */}
    </div>
  );
}
```

### Add a Custom Network

```tsx
import { useWeb3 } from 'next-web3-basic';
import type { NetworkConfig } from 'next-web3-basic';

export default function AddCustomNetwork() {
  const { provider } = useWeb3();
  
  const addNetwork = async () => {
    if (!provider || !window.ethereum) return;
    
    const customNetwork: NetworkConfig = {
      chainId: 1337,
      chainName: 'Local Hardhat',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: ['http://localhost:8545'],
    };
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${customNetwork.chainId.toString(16)}`,
          chainName: customNetwork.chainName,
          nativeCurrency: customNetwork.nativeCurrency,
          rpcUrls: customNetwork.rpcUrls,
          blockExplorerUrls: customNetwork.blockExplorerUrls || [],
        }]
      });
    } catch (error) {
      console.error('Error adding network:', error);
    }
  };
  
  return (
    <button onClick={addNetwork}>
      Add Local Network
    </button>
  );
}
```

## Contract Interaction

```tsx
import { useState, useEffect } from 'react';
import { useWeb3 } from 'next-web3-basic';
import { ethers } from 'ethers';

// ERC-20 token ABI (minimal)
const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
];

export default function TokenBalance() {
  const { provider, account } = useWeb3();
  const [tokenAddress, setTokenAddress] = useState('0x6B175474E89094C44Da98b954EedeAC495271d0F'); // DAI
  const [balance, setBalance] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!provider || !account || !tokenAddress) return;
      
      try {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
        
        // Get token metadata
        const [name, symbol, decimals, rawBalance] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals(),
          tokenContract.balanceOf(account)
        ]);
        
        // Format balance with proper decimals
        const formattedBalance = ethers.formatUnits(rawBalance, decimals);
        
        setTokenName(name);
        setTokenSymbol(symbol);
        setBalance(formattedBalance);
      } catch (error) {
        console.error('Error fetching token info:', error);
      }
    };
    
    fetchTokenInfo();
  }, [provider, account, tokenAddress]);

  return (
    <div>
      <h2>Token Balance</h2>
      <input
        type="text"
        placeholder="Token Address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      
      {tokenName && tokenSymbol && (
        <div>
          <h3>{tokenName} ({tokenSymbol})</h3>
          <p>Balance: {balance ? `${balance} ${tokenSymbol}` : 'Loading...'}</p>
        </div>
      )}
    </div>
  );
}
```

## Styling

The components don't include any styling by default, but you can easily style them using CSS, Tailwind, or any other styling solution. Each component has appropriate class names for styling.

## Types

All components and functions are fully typed:

```tsx
import type { 
  Web3ContextType,
  Web3ProviderProps,
  NetworkConfig,
  ChainId
} from 'next-web3-basic';
```

## Browser Support

- Chrome, Firefox, Brave, Edge with MetaMask extension
- Mobile browsers with MetaMask Mobile or similar dapp browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
