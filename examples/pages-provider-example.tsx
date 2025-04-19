// Example App Provider (for Next.js Pages Router)
import { Web3Provider } from 'next-web3-basic';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider
      autoConnect={false}
      supportedChainIds={[1, 5, 137, 80001]}
    >
      <Component {...pageProps} />
    </Web3Provider>
  );
}
