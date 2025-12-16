import { useState } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { Shield, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_NAME } from '../lib/contract';

export default function ConnectWallet() {
  const { setCurrentScreen } = useApp();
  const { address, status } = useAccount();
  const { open } = useAppKit();
  const [consentData, setConsentData] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const canContinue = address && consentData && consentPrivacy;
  const isConnecting = status === 'connecting' || status === 'reconnecting';

  const handleConnect = async () => {
    try {
      setConnectError(null);
      await open?.();
    } catch (err) {
      console.error('Error opening wallet selector:', err);
      setConnectError('No pudimos abrir el selector de wallets. Inténtalo de nuevo.');
    }
  };

  const handleContinue = () => {
    if (canContinue) {
      setCurrentScreen('generate');
    }
  };

  return (
    <div className="page-section">
      <div className="section-shell max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="tag-pill mx-auto w-fit">
            <Shield className="w-4 h-4" />
            Paso 1 · Autorización
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Conecta y autoriza</h1>
          <p className="text-dark-muted">
            Necesitamos tu permiso para leer señales on-chain y emitir una prueba sellada sin PII.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                1. Conecta tu wallet
              </h2>
              <span className="chip chip-positive text-xs">Scroll · {SCROLL_SEPOLIA_NAME}</span>
            </div>
            {!address ? (
              <div className="space-y-4">
                <p className="text-dark-muted text-sm">
                  Usaremos tu wallet para analizar señales on-chain. Nada se comparte sin tu consentimiento
                  y puedes desconectarte cuando quieras.
                </p>
                {connectError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-left text-sm text-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {connectError}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="btn-primary w-full"
                >
                  {isConnecting ? 'Conectando...' : 'Conectar wallet'}
                </button>
                <p className="text-xs text-dark-muted text-center">
                  Se abrirá Reown (WalletConnect) para elegir tu wallet en {SCROLL_SEPOLIA_NAME}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-4 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">Wallet conectada</p>
                    <p className="text-xs text-dark-muted font-mono truncate">{address}</p>
                  </div>
                </div>
                <button
                  onClick={handleConnect}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Administrar conexión
                </button>
                {connectError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
                    {connectError}
                  </div>
                )}
                <p className="text-xs text-dark-muted">
                  Usa el modal de Reown para cambiar de wallet o red.
                </p>
              </div>
            )}
          </div>

          <div className="glow-divider" />

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">2. Otorga consentimiento</h2>
            <p className="text-dark-muted text-sm mb-4">
              Lee y acepta ambos términos para continuar con la generación de la prueba.
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 cursor-pointer transition hover:border-white/30">
                <input
                  type="checkbox"
                  checked={consentData}
                  onChange={(e) => setConsentData(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/30 bg-transparent text-accent focus:ring-accent/50"
                />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Analizar actividad on-chain</p>
                  <p className="text-xs text-dark-muted">
                    Permitimos que PrivyCredit calcule factores (estabilidad, inflows, riesgo) usando tu wallet.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 cursor-pointer transition hover:border-white/30">
                <input
                  type="checkbox"
                  checked={consentPrivacy}
                  onChange={(e) => setConsentPrivacy(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/30 bg-transparent text-accent focus:ring-accent/50"
                />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Generar prueba sellada sin PII</p>
                  <p className="text-xs text-dark-muted">
                    Se emitirá una prueba con bandas A/B/C sin exponer montos exactos ni contrapartes.
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-dark-muted">
              <ExternalLink className="w-3 h-3" />
              <a href="#" className="hover:text-white transition-colors">
                Términos de servicio
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">
                Política de privacidad
              </a>
            </div>
          </div>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="btn-ghost w-full justify-between text-sm"
          >
            ¿Qué es una prueba sellada?
            <span>{showHelp ? '−' : '+'}</span>
          </button>

          {showHelp && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-dark-muted">
              Una <strong className="text-white">prueba sellada</strong> demuestra que cumples criterios financieros
              sin divulgar los datos que lo sustentan. Es como probar mayoría de edad sin mostrar tu fecha exacta de nacimiento.
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`btn-primary w-full ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continuar
            </button>
            {!canContinue && address && (
              <p className="text-center text-xs text-dark-muted">
                Acepta ambos consentimientos para continuar.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('landing')}
          className="btn-ghost mx-auto"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
