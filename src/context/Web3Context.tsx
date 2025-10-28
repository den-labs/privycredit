import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Address } from 'viem';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  account: Address | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Address | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const isConnected = !!account;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0] as Address);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      });

      const initChainId = async () => {
        try {
          const id = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(id, 16));
        } catch (err) {
          console.error('Error getting chain ID:', err);
        }
      };

      initChainId();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Por favor instala MetaMask u otra wallet compatible');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0] as Address);

        const targetChainId = 534352;
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (parseInt(currentChainId, 16) !== targetChainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${targetChainId.toString(16)}`,
                      chainName: 'Scroll',
                      nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      rpcUrls: ['https://rpc.scroll.io'],
                      blockExplorerUrls: ['https://scrollscan.com'],
                    },
                  ],
                });
              } catch (addError) {
                throw new Error('No se pudo agregar la red Scroll');
              }
            } else {
              throw switchError;
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Error al conectar la wallet');
      setAccount(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setError(null);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
