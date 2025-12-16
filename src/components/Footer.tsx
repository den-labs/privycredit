import { Shield, ExternalLink } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import {
  SCROLL_SEPOLIA_NAME,
  SCROLL_SEPOLIA_EXPLORER,
  CONTRACT_ADDRESS,
  SCROLL_SEPOLIA_CHAIN_ID,
} from '../lib/contract';

export default function Footer() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isCorrectNetwork = chainId === SCROLL_SEPOLIA_CHAIN_ID;

  return (
    <footer className="border-t border-white/5 bg-[#020617]/40 backdrop-blur-lg mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PrivyCredit</span>
            </div>
            <p className="text-blue-100/60 text-sm leading-relaxed max-w-md">
              Infraestructura para reputación financiera privada en Scroll. Demuestra solvencia y comparte solo lo
              necesario con tus contrapartes.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Explorar</h4>
            <ul className="space-y-3 text-sm text-blue-100/60">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-blue-300 transition-colors"
                >
                  Protocolo
                </button>
              </li>
              <li>
                <button className="hover:text-blue-300 transition-colors" onClick={() => window.scrollTo({ top: 0 })}>
                  Casos de uso
                </button>
              </li>
              <li>
                <button className="hover:text-blue-300 transition-colors" onClick={() => window.scrollTo({ top: 0 })}>
                  Developers
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Contrato</h4>
            <p className="text-xs text-blue-100/60 mb-2 uppercase tracking-[0.3em]">Scroll Sepolia</p>
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors"
            >
              {CONTRACT_ADDRESS.substring(0, 6)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 4)}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-blue-100/40 gap-4">
          <p>©️ 2024 Den Labs &amp; PrivyCredit. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? (isCorrectNetwork ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-slate-400'
              } shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
            />
            <span className="font-mono text-[11px] text-blue-100/70">
              {isConnected
                ? isCorrectNetwork
                  ? `System Status: Scroll (${SCROLL_SEPOLIA_NAME})`
                  : 'System Status: Cambia de red'
                : 'System Status: Desconectado'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
