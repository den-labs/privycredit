import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { SCROLL_SEPOLIA_CHAIN_ID, SCROLL_SEPOLIA_NAME } from '../lib/contract';

export default function NetworkAlert() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();
  const [dismissed, setDismissed] = useState(false);

  const isWrongNetwork = isConnected && chainId !== SCROLL_SEPOLIA_CHAIN_ID;

  if (!isWrongNetwork || dismissed) return null;

  const handleSwitchNetwork = async () => {
    try {
      await switchChainAsync?.({ chainId: SCROLL_SEPOLIA_CHAIN_ID });
    } catch (switchError) {
      console.error('Failed to switch Scroll network:', switchError);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-amber-50 backdrop-blur-sm border-2 border-amber-400 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 mb-1">Red incorrecta</h3>
            <p className="text-amber-700 text-sm mb-3">
              Esta aplicación solo funciona en {SCROLL_SEPOLIA_NAME}.
              Por favor cambia tu red para continuar.
            </p>
            <button
              onClick={handleSwitchNetwork}
              disabled={isPending}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              {isPending ? 'Cambiando...' : `Cambiar a ${SCROLL_SEPOLIA_NAME}`}
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-500 hover:text-amber-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
