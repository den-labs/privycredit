import { CheckCircle, Share2, Eye, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_EXPLORER } from '../lib/contract';
import { Badge, Button, Card } from './ui';

export default function ResultApto() {
  const { currentProof, setCurrentScreen } = useApp();

  if (!currentProof) {
    setCurrentScreen('landing');
    return null;
  }

  const factors = [
    { label: 'Estabilidad', description: 'Consistencia de saldos', value: currentProof.factors.estabilidad },
    { label: 'Inflows', description: 'Ingresos recurrentes', value: currentProof.factors.inflows },
    { label: 'Riesgo', description: 'Gestión de volatilidad', value: currentProof.factors.riesgo },
  ];

  return (
    <div className="px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge type="success" className="mx-auto">
            Validación completa
          </Badge>
          <h1 className="text-4xl font-semibold text-white">¡Eres apto!</h1>
          <p className="text-blue-100/80 text-lg">Tu perfil cumple los criterios de los pools institucionales.</p>
        </div>

        <Card className="!border-emerald-500/30 !bg-[#022c22]/80 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_#10B981]" />
          <div className="pt-10 pb-6 px-4 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
              <CheckCircle className="w-8 h-8 text-emerald-400 relative z-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Perfil aprobado</h2>
              <p className="text-emerald-100/70 text-sm max-w-lg mx-auto">
                Comparte la prueba sellada con un clic. Tus montos y contrapartes siguen privados.
              </p>
            </div>

            <div className="bg-black/20 rounded-2xl p-6 border border-emerald-500/20 mx-4">
              <div className="flex justify-between items-end mb-4">
                <span className="text-emerald-100/60 text-sm font-medium">Privy Score</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-white">850</span>
                  <span className="text-sm text-emerald-100/40">/1000</span>
                </div>
              </div>
              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] relative">
                  <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4">
              <div className="p-4 rounded-xl bg-black/20 border border-emerald-500/10 text-left">
                <div className="text-[10px] text-emerald-100/50 uppercase tracking-widest font-bold mb-1">Capacidad</div>
                <div className="text-xl font-semibold text-white">2,000 USDC</div>
              </div>
              <div className="p-4 rounded-xl bg-black/20 border border-emerald-500/10 text-left">
                <div className="text-[10px] text-emerald-100/50 uppercase tracking-widest font-bold mb-1">
                  Interés (APR)
                </div>
                <div className="text-xl font-semibold text-emerald-400">5.2%</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Factores evaluados</h2>
          <p className="text-sm text-blue-100/70">
            Estos indicadores se comparten con el prestamista. No incluimos montos, contrapartes ni PII.
          </p>
          <div className="space-y-3">
            {factors.map((factor) => (
              <div
                key={factor.label}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <h3 className="text-white font-semibold">{factor.label}</h3>
                  <p className="text-xs text-blue-100/70">{factor.description}</p>
                </div>
                <span className="band-pill" data-tone={factor.value}>
                  Banda {factor.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-100/70 uppercase tracking-[0.4em]">Metadatos</h3>
          <div className="space-y-2 text-sm text-blue-100/70">
            <div className="flex justify-between gap-4">
              <span>ID de prueba:</span>
              <span className="text-white font-mono text-xs">
                {currentProof.blockchain_proof_id.substring(0, 10)}...
                {currentProof.blockchain_proof_id.substring(currentProof.blockchain_proof_id.length - 8)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Válida hasta:</span>
              <span className="text-white">{new Date(currentProof.expires_at).toLocaleDateString()}</span>
            </div>
            {currentProof.tx_hash && (
              <div className="flex justify-between gap-4">
                <span>Transacción:</span>
                <a
                  href={`${SCROLL_SEPOLIA_EXPLORER}/tx/${currentProof.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-200 hover:text-white text-xs"
                >
                  Ver en blockchain
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          <Button onClick={() => setCurrentScreen('share')} className="w-full justify-center">
            <Share2 className="w-5 h-5" />
            Compartir prueba
          </Button>
          <Button variant="secondary" onClick={() => setCurrentScreen('share')} className="w-full justify-center">
            <Eye className="w-5 h-5" />
            Ver detalles
          </Button>
        </div>

        <Button variant="ghost" onClick={() => setCurrentScreen('landing')} className="mx-auto text-blue-200/80">
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}
