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
      <div className="flex flex-wrap items-center justify-end gap-2 bg-dark-card/80 backdrop-blur border border-dark-border/70 rounded-2xl px-3 py-2 shadow-lg">
        {isConnected && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">Red</span>
            <AppKitNetworkButton />
          </div>
        )}
        <button
          onClick={handleOpen}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-primary-dark text-dark px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all"
        >
          <Wallet className="w-4 h-4" />
          {isConnected ? 'Gestionar wallet' : 'Conectar wallet'}
        </button>
      </div>
    </div>
  );
}
