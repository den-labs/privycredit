import { AppKitNetworkButton, useAppKit } from '@reown/appkit/react';
import { Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function WalletControls() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  const handleOpen = () => {
    open?.();
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-white/15 bg-black/40 px-4 py-2 shadow-[0_20px_50px_rgba(3,7,17,0.55)] backdrop-blur-xl">
        {isConnected && (
          <div className="flex items-center gap-2 text-xs text-dark-muted">
            <span className="hidden sm:inline">Red</span>
            <AppKitNetworkButton />
          </div>
        )}
        <button onClick={handleOpen} className="btn-primary text-xs sm:text-sm">
          <Wallet className="w-4 h-4" />
          {isConnected ? 'Gestionar wallet' : 'Conectar wallet'}
        </button>
      </div>
    </div>
  );
}
