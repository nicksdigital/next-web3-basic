// Example combined wallet dashboard
import React from 'react';
import { ConnectButton, NetworkSwitcher, WalletInfo, useWeb3 } from 'next-web3-basic';

export default function WalletDashboard() {
  const { account, chainId } = useWeb3();
  
  return (
    <div className="wallet-dashboard">
      <h1>Web3 Dashboard</h1>
      
      <div className="connection-section">
        <ConnectButton 
          connectText="Connect Wallet"
          disconnectText="Disconnect"
          loadingText="Connecting..."
          showAddress={true}
          className="connect-button"
        />
      </div>
      
      {account && (
        <>
          <div className="wallet-section">
            <h2>Wallet Details</h2>
            <WalletInfo 
              showBalance={true}
              showNetwork={true}
              showAvatar={true}
              className="wallet-info-card"
            />
          </div>
          
          <div className="network-section">
            <h2>Network</h2>
            <NetworkSwitcher 
              networks={[
                { chainId: 1, name: 'Ethereum Mainnet' },
                { chainId: 5, name: 'Goerli Testnet' },
                { chainId: 137, name: 'Polygon Mainnet' },
                { chainId: 80001, name: 'Polygon Mumbai' },
              ]}
              className="network-switcher"
            />
            <p className="current-network">
              Current Network ID: {chainId ? chainId.toString() : 'Not connected'}
            </p>
          </div>
          
          <div className="transaction-section">
            <h2>Send Transaction</h2>
            <SendTransactionForm />
          </div>
        </>
      )}
    </div>
  );
}

// Example form for sending transactions
function SendTransactionForm() {
  const { signer } = useWeb3();
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [txHash, setTxHash] = React.useState('');
  const [error, setError] = React.useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !recipient || !amount) return;
    
    setIsSubmitting(true);
    setError('');
    setTxHash('');
    
    try {
      // Get ethers from the correct import 
      const { ethers } = await import('ethers');
      
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      });
      
      setTxHash(tx.hash);
      
      // Wait for transaction confirmation
      await tx.wait();
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="tx-form">
      <div className="form-group">
        <label htmlFor="recipient">Recipient Address:</label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount (ETH):</label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting || !signer}
        className="send-button"
      >
        {isSubmitting ? 'Sending...' : 'Send ETH'}
      </button>
      
      {txHash && (
        <div className="success-message">
          Transaction sent! Hash: {txHash}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
    </form>
  );
}
