import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Proof } from '../types';

interface AppContextType {
  currentProof: Proof | null;
  setCurrentProof: (proof: Proof | null) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentProof, setCurrentProof] = useState<Proof | null>(null);
  const [currentScreen, setCurrentScreen] = useState('landing');

  return (
    <AppContext.Provider
      value={{
        currentProof,
        setCurrentProof,
        currentScreen,
        setCurrentScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
