import React from 'react';
import { useWallet } from './WalletProvider';

export const ConnectWallet: React.FC = () => {
  const { address, isConnected, connect, disconnect } = useWallet();

  if (isConnected) {
    return (
      <div className="stellarflow-wallet-connected">
        <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        <button onClick={disconnect} className="stellarflow-btn-disconnect">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} className="stellarflow-btn-connect">
      Connect Freighter
    </button>
  );
};
