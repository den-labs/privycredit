import { CheckCircle, Share2, Eye, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_EXPLORER } from '../lib/contract';
import { BandLevel } from '../types';

const getBandColor = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'B':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'C':
      return 'bg-red-100 text-red-700 border-red-300';
  }
};

export default function ResultApto() {
  const { currentProof, setCurrentScreen } = useApp();

  if (!currentProof) {
    setCurrentScreen('landing');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex bg-green-100 rounded-full p-6 mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-dark mb-3">¡Apto!</h1>
          <p className="text-dark text-lg">
            Tu perfil cumple los criterios de evaluación
          </p>
        </div>

        <div className="bg-light-card/80 backdrop-blur-sm rounded-3xl border border-light-border shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-dark mb-6">Factores evaluados</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-light-border">
              <div>
                <h3 className="font-medium text-dark mb-1">Estabilidad</h3>
                <p className="text-xs text-dark-muted">Consistencia de saldos</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBandColor(currentProof.factors.estabilidad)}`}>
                Banda {currentProof.factors.estabilidad}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-light-border">
              <div>
                <h3 className="font-medium text-dark mb-1">Inflows</h3>
                <p className="text-xs text-dark-muted">Ingresos recurrentes</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBandColor(currentProof.factors.inflows)}`}>
                Banda {currentProof.factors.inflows}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-light-border">
              <div>
                <h3 className="font-medium text-dark mb-1">Riesgo</h3>
                <p className="text-xs text-dark-muted">Gestión de volatilidad</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBandColor(currentProof.factors.riesgo)}`}>
                Banda {currentProof.factors.riesgo}
              </span>
            </div>
          </div>

          <div className="bg-secondary/20 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-dark text-sm">
              <strong>Privacidad protegida:</strong> Solo se comparten estas bandas.
              Tus montos y contrapartes permanecen privados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentScreen('share')}
              className="flex items-center justify-center gap-2 bg-accent hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-all shadow-md"
            >
              <Share2 className="w-5 h-5" />
              Compartir con prestamista
            </button>

            <button
              onClick={() => setCurrentScreen('share')}
              className="flex items-center justify-center gap-2 bg-light-card hover:bg-light border border-light-border text-dark py-3 rounded-xl font-semibold transition-all"
            >
              <Eye className="w-5 h-5" />
              Ver detalles
            </button>
          </div>
        </div>

        <div className="bg-light-card/80 backdrop-blur-sm rounded-2xl border border-light-border shadow-md p-6 mb-6">
          <h3 className="text-sm font-semibold text-dark mb-3">Información de la prueba</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-muted">ID de prueba:</span>
              <span className="text-dark font-mono text-xs">
                {currentProof.blockchain_proof_id.substring(0, 10)}...
                {currentProof.blockchain_proof_id.substring(currentProof.blockchain_proof_id.length - 8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-muted">Válida hasta:</span>
              <span className="text-dark">
                {new Date(currentProof.expires_at).toLocaleDateString()}
              </span>
            </div>
            {currentProof.tx_hash && (
              <div className="flex justify-between items-center">
                <span className="text-dark-muted">Transacción:</span>
                <a
                  href={`${SCROLL_SEPOLIA_EXPLORER}/tx/${currentProof.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1 text-xs"
                >
                  Ver en blockchain
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('landing')}
          className="text-dark-muted hover:text-dark text-sm transition-colors mx-auto block"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
