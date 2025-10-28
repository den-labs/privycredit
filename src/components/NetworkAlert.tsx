import { AlertTriangle } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { SCROLL_SEPOLIA_CHAIN_ID, SCROLL_SEPOLIA_NAME } from '../lib/contract';

export default function NetworkAlert() {
  const { chainId, isConnected } = useWeb3();

  if (!isConnected || chainId === SCROLL_SEPOLIA_CHAIN_ID) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
      <div className="bg-amber-900/90 border-2 border-amber-500 rounded-2xl p-4 backdrop-blur-sm shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">Red incorrecta detectada</h3>
            <p className="text-amber-100 text-sm mb-3">
              Esta aplicación solo funciona en <strong>{SCROLL_SEPOLIA_NAME}</strong>.
              Por favor cambia tu red en MetaMask.
            </p>
            <button
              onClick={async () => {
                if (!window.ethereum) return;
                try {
                  await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${SCROLL_SEPOLIA_CHAIN_ID.toString(16)}` }],
                  });
                } catch (error) {
                  console.error('Error switching network:', error);
                }
              }}
              className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Cambiar a {SCROLL_SEPOLIA_NAME}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
