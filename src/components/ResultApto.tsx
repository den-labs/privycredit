import { CheckCircle, Share2, Eye, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_EXPLORER } from '../lib/contract';

export default function ResultApto() {
  const { currentProof, setCurrentScreen } = useApp();

  if (!currentProof) {
    setCurrentScreen('landing');
    return null;
  }

  return (
    <div className="page-section">
      <div className="section-shell max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-6">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-4xl font-semibold text-white">¡Apto!</h1>
          <p className="text-dark-muted text-lg">Tu perfil cumple los criterios de evaluación.</p>
        </div>

        <div className="glass-panel p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Factores evaluados</h2>
            <div className="space-y-4">
              {[
                { label: 'Estabilidad', description: 'Consistencia de saldos', value: currentProof.factors.estabilidad },
                { label: 'Inflows', description: 'Ingresos recurrentes', value: currentProof.factors.inflows },
                { label: 'Riesgo', description: 'Gestión de volatilidad', value: currentProof.factors.riesgo },
              ].map((factor) => (
                <div
                  key={factor.label}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <h3 className="text-white font-medium">{factor.label}</h3>
                    <p className="text-xs text-dark-muted">{factor.description}</p>
                  </div>
                  <span className="band-pill" data-tone={factor.value}>
                    Banda {factor.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-dark-muted">
            <strong className="text-white">Privacidad protegida:</strong> Compartimos únicamente estas bandas y el
            estado final. Montos y contrapartes permanecen privados.
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button onClick={() => setCurrentScreen('share')} className="btn-primary w-full">
              <Share2 className="w-5 h-5" />
              Compartir
            </button>
            <button onClick={() => setCurrentScreen('share')} className="btn-secondary w-full">
              <Eye className="w-5 h-5" />
              Ver detalles
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-[0.3em]">Metadatos</h3>
          <div className="space-y-2 text-sm text-dark-muted">
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
                  className="inline-flex items-center gap-1 text-accent hover:text-white text-xs"
                >
                  Ver en blockchain
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setCurrentScreen('landing')} className="btn-ghost mx-auto">
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
