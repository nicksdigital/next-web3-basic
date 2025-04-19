import { NextConfig } from 'next';
import { WithWeb3Options } from './src/types';

/**
 * Web3 plugin for Next.js
 * @param {NextConfig} nextConfig - Existing Next.js configuration
 * @param {WithWeb3Options} pluginOptions - Plugin options
 * @returns {NextConfig} - Modified Next.js configuration
 */
const withWeb3Basic = (
  nextConfig: NextConfig = {}, 
  pluginOptions: WithWeb3Options = {}
): NextConfig => {
  return {
    ...nextConfig,
    
    // Add specific environment variables if needed
    env: {
      ...(nextConfig.env || {}),
      NEXT_PUBLIC_WEB3_AUTO_CONNECT: pluginOptions.autoConnect ? 'true' : 'false',
      NEXT_PUBLIC_WEB3_REQUIRED_CHAIN_ID: pluginOptions.requiredChainId?.toString() || '',
      NEXT_PUBLIC_WEB3_SUPPORTED_CHAIN_IDS: pluginOptions.supportedChainIds?.join(',') || '',
    },
    
    // Webpack config to handle ethers.js in Next.js
    webpack(config: any, options: any) {
      // Add polyfills for Node.js core modules used by ethers if not in server context
      if (!options.isServer) {
        config.resolve = config.resolve || {};
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          net: false,
          tls: false,
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          assert: require.resolve('assert'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify'),
          url: require.resolve('url'),
          path: require.resolve('path-browserify'),
        };
      }
      
      // Pass through the original webpack config if it exists
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      
      return config;
    },
  };
};

// Export the plugin function as default
export default withWeb3Basic;

// Export all components, context, and types
export * from './src/components';
export * from './src/contexts/Web3Context';
export * from './src/types';
