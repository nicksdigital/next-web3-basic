// Example next.config.js
const withWeb3Basic = require('next-web3-basic').default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
  reactStrictMode: true,
  swcMinify: true,
};

// Basic usage with default settings
module.exports = withWeb3Basic(nextConfig);

// Advanced usage with options
/*
module.exports = withWeb3Basic(
  nextConfig,
  {
    // Auto connect to wallet on page load
    autoConnect: false,
    
    // List of supported chain IDs
    supportedChainIds: [1, 5, 137, 80001],
    
    // Required chain ID - users will be prompted to switch if on a different network
    requiredChainId: 1,
    
    // Metadata for wallet apps
    dappMetadata: {
      name: 'My Dapp',
      description: 'A Next.js dapp using next-web3-basic',
      url: 'https://mydapp.example.com',
      icons: ['https://mydapp.example.com/icon.png']
    }
  }
);
*/
