import { AlertCircle, Zap, X } from 'lucide-react';
import { useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { SCROLL_SEPOLIA_CHAIN_ID, SCROLL_SEPOLIA_NAME } from '../lib/contract';
import { Button } from './ui';

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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] max-w-2xl w-full px-4">
      <div className="border border-amber-500/10 bg-gradient-to-r from-amber-900/80 to-amber-700/40 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="flex items-start gap-4 px-6 py-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 text-sm text-amber-50">
            <p className="uppercase text-[11px] tracking-[0.3em] text-amber-200/70 mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Scroll Testnet
            </p>
            <h3 className="text-white font-semibold text-base mb-1">Necesitas cambiar de red</h3>
            <p className="text-amber-100/80 mb-3">
              Esta dApp opera únicamente en {SCROLL_SEPOLIA_NAME}. Cambia tu wallet para continuar con el flujo.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleSwitchNetwork}
                disabled={isPending}
                className={`w-full justify-center !bg-amber-500 hover:!bg-amber-400 !border-amber-400/70 ${
                  isPending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Zap className="w-4 h-4" />
                {isPending ? 'Cambiando…' : `Cambiar a ${SCROLL_SEPOLIA_NAME}`}
              </Button>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs text-amber-100/60 hover:text-white transition-colors"
              >
                Entiendo el riesgo
              </button>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="text-amber-200/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
