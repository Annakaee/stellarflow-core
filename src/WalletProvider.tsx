import React, { createContext, useContext } from 'react';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  return <WalletContext.Provider value={{}}>{children}</WalletContext.Provider>;
};
