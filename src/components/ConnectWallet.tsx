import { useState } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { Shield, CheckCircle, ExternalLink, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, Button, Card } from './ui';

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
    <div className="px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <Badge className="mx-auto">
            <Shield className="w-3.5 h-3.5" />
            Paso 1 · Autorización
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Conecta y autoriza</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="space-y-6 py-10 px-8 !bg-[#0a1428]/80">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-[#0f172a] rounded-2xl flex items-center justify-center border border-white/10">
                  <Shield className="w-8 h-8 text-blue-300" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Conecta tu billetera</h2>
                <p className="text-blue-100/70 text-sm">
                  Presiona &quot;Administrar conexion&quot;.
                </p>
              </div>
            </div>

            {!address ? (
              <div className="space-y-4">
                {connectError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-left text-sm text-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {connectError}
                    </div>
                  </div>
                )}
                <Button onClick={handleConnect} disabled={isConnecting} className="w-full justify-center py-4 text-base">
                  {isConnecting ? 'Conectando...' : 'Conectar wallet'}
                </Button>
                <Button
                  onClick={handleConnect}
                  variant="outline"
                  className="w-full justify-center border-white/10 hover:bg-white/5"
                >
                  <span className="mr-2">🦊</span> MetaMask / Rabby
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-white">Wallet conectada</p>
                    <p className="text-xs text-emerald-100/70 font-mono truncate">{address}</p>
                  </div>
                </div>
                <Button onClick={handleConnect} variant="secondary" className="w-full justify-center">
                  Administrar conexión
                </Button>
                {connectError && (
                  <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200 text-center">
                    {connectError}
                  </div>
                )}
                <p className="text-xs text-blue-100/60 text-center">
                  Usa el modal de Reown para cambiar de wallet o red.
                </p>
              </div>
            )}
          </Card>

          <Card className="space-y-6 py-10 px-8 !bg-[#0b1a2f]/80">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-300" />
                Consentimientos
              </h2>
              <p className="text-blue-100/70 text-sm">
                Acepta ambos para continuar. No se expone ningún dato sin estos permisos.
              </p>
            </div>
            <div className="space-y-4">
              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 cursor-pointer transition hover:border-white/30">
                <input
                  type="checkbox"
                  checked={consentData}
                  onChange={(e) => setConsentData(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/30 bg-transparent text-blue-400 focus:ring-blue-300"
                />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Analizar actividad on-chain</p>
                  <p className="text-xs text-blue-100/60">
                    Calculamos estabilidad, inflows y riesgo usando tus señales en Scroll.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 cursor-pointer transition hover:border-white/30">
                <input
                  type="checkbox"
                  checked={consentPrivacy}
                  onChange={(e) => setConsentPrivacy(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/30 bg-transparent text-blue-400 focus:ring-blue-300"
                />
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Generar prueba sellada</p>
                  <p className="text-xs text-blue-100/60">Emitimos bandas A/B/C sin revelar montos ni contrapartes.</p>
                </div>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100/60">
              <ExternalLink className="w-3.5 h-3.5" />
              <a href="#" className="hover:text-white transition-colors">
                Términos de servicio
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">
                Política de privacidad
              </a>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`w-full justify-center py-4 text-base ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continuar
          </Button>
          {!canContinue && address && (
            <p className="text-center text-xs text-blue-200/60">Acepta ambos consentimientos para continuar.</p>
          )}
        </div>

        <Card className="space-y-4 !bg-[#050b18]/80">
          <button
            onClick={() => setShowHelp((prev) => !prev)}
            className="w-full flex items-center justify-between text-sm text-blue-100/80"
          >
            ¿Qué es una prueba sellada?
            <span>{showHelp ? '−' : '+'}</span>
          </button>
          {showHelp && (
            <p className="text-sm text-blue-100/70">
              Una <strong className="text-white">prueba sellada</strong> demuestra que cumples criterios financieros sin
              divulgar los datos que lo respaldan. Es como probar mayoría de edad sin mostrar tu fecha exacta de nacimiento.
            </p>
          )}
        </Card>

        <Button variant="ghost" onClick={() => setCurrentScreen('landing')} className="mx-auto text-blue-200/80">
          ← Volver
        </Button>
      </div>
    </div>
  );
}
