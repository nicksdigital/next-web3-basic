// Example App Provider (for Next.js App Router)
import { Web3Provider } from 'next-web3-basic';

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider
          autoConnect={false}
          supportedChainIds={[1, 5, 137, 80001]}
        >
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
