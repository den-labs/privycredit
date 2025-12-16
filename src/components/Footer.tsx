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
    <footer className="py-8 px-4 mt-auto">
      <div className="section-shell">
        <div className="glass-panel px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/15 bg-white/5 p-2">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">PrivyCredit Demo</p>
              <p className="text-xs text-dark-muted">Pruebas selladas on-chain</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs text-dark-muted">
            <div className="flex items-center gap-2">
              <span>Red:</span>
              <span className={`font-semibold ${isConnected && isCorrectNetwork ? 'text-accent' : 'text-white'}`}>
                {SCROLL_SEPOLIA_NAME}
              </span>
              {isConnected && (
                <span
                  className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-accent' : 'bg-amber-400'} animate-pulse`}
                />
              )}
            </div>
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:text-white transition-colors"
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
