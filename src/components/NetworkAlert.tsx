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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <div className="glass-panel p-4 border-amber-400/40 bg-amber-500/10 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-amber-50">
            <h3 className="font-semibold text-white mb-1">Red incorrecta</h3>
            <p className="mb-3">
              Esta aplicación solo funciona en {SCROLL_SEPOLIA_NAME}. Cambia tu red para continuar.
            </p>
            <button
              onClick={handleSwitchNetwork}
              disabled={isPending}
              className={`btn-secondary w-full justify-center ${isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isPending ? 'Cambiando…' : `Cambiar a ${SCROLL_SEPOLIA_NAME}`}
            </button>
          </div>
          <button onClick={() => setDismissed(true)} className="btn-ghost px-2 py-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
