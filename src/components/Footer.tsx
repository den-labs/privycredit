import { Shield, ExternalLink } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import {
  SCROLL_SEPOLIA_NAME,
  SCROLL_SEPOLIA_EXPLORER,
  CONTRACT_ADDRESS,
  SCROLL_SEPOLIA_CHAIN_ID
} from '../lib/contract';

export default function Footer() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isCorrectNetwork = chainId === SCROLL_SEPOLIA_CHAIN_ID;

  return (
    <footer className="bg-light-card/80 border-t border-light-border py-6 mt-auto shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-semibold text-dark">PrivyCredit Demo</p>
              <p className="text-xs text-dark-muted">Pruebas selladas on-chain</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-muted">Red:</span>
              <span className={`text-xs font-semibold ${isConnected && isCorrectNetwork ? 'text-accent' : 'text-dark'}`}>
                {SCROLL_SEPOLIA_NAME}
              </span>
              {isConnected && (
                <span className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-accent' : 'bg-amber-500'}`} />
              )}
            </div>
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-dark-muted hover:text-accent transition-colors flex items-center gap-1"
            >
              Contrato: {CONTRACT_ADDRESS.substring(0, 6)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 4)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
