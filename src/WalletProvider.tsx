import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAllowed, setAllowed, getUserInfo } from '@stellar/freighter-api';

export interface WalletContextState {
  address: string | null;
  network: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextState | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // Check if already allowed on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const allowed = await isAllowed();
        if (allowed) {
          const userInfo = await getUserInfo();
          if (userInfo.publicKey) {
            setAddress(userInfo.publicKey);
          }
        }
      } catch (error) {
        console.error("Error checking Freighter connection:", error);
      }
    };
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      await setAllowed();
      const userInfo = await getUserInfo();
      if (userInfo.publicKey) {
        setAddress(userInfo.publicKey);
      }
    } catch (error) {
      console.error("Failed to connect to Freighter:", error);
    }
  };

  const disconnect = () => {
    // Freighter doesn't have a strict disconnect API from the dApp side,
    // so we just clear the local state.
    setAddress(null);
  };

  return (
    <WalletContext.Provider 
      value={{ 
        address, 
        network, 
        isConnected: !!address, 
        connect, 
        disconnect 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
