import { CheckCircle, Share2, Info, ChevronRight, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BandLevel } from '../types';
import { SCROLL_SEPOLIA_EXPLORER } from '../lib/contract';

const getBandColor = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'bg-primary/20 text-primary border-primary/200';
    case 'B':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'C':
      return 'bg-red-100 text-red-700 border-red-200';
  }
};

const getBandLabel = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'Alto';
    case 'B':
      return 'Medio';
    case 'C':
      return 'Bajo';
  }
};

export default function ResultApto() {
  const { currentProof, setCurrentScreen } = useApp();

  if (!currentProof) {
    return null;
  }

  const factors = [
    { key: 'estabilidad', label: 'Estabilidad', value: currentProof.factors.estabilidad },
    { key: 'inflows', label: 'Ingresos', value: currentProof.factors.inflows },
    { key: 'riesgo', label: 'Riesgo', value: currentProof.factors.riesgo },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="bg-dark-card rounded-[2.5rem] shadow-xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary rounded-full p-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 text-center">
            ¡Apto!
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Cumples los umbrales de solvencia. Puedes compartir tu prueba sellada con prestamistas.
          </p>

          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-primary/200 rounded-[2rem] p-6 mb-8">
            <h3 className="font-semibold text-white mb-4">Bandas por factor</h3>
            <div className="space-y-3">
              {factors.map((factor) => (
                <div key={factor.key} className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">{factor.label}</span>
                  <span
                    className={`px-4 py-2 rounded-lg border font-semibold ${getBandColor(
                      factor.value
                    )}`}
                  >
                    Banda {factor.value} - {getBandLabel(factor.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                Tu prueba muestra bandas y umbrales, no montos exactos ni contrapartes.
                Tu privacidad está protegida.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setCurrentScreen('share')}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Compartir con prestamista
            </button>

            <button
              onClick={() => setCurrentScreen('simulator')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-white py-4 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Ver simulador
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500 text-center">
              ID de Prueba: {currentProof.id.substring(0, 8)}...
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Válida hasta:{' '}
              {new Date(currentProof.expires_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {currentProof.tx_hash && (
              <p className="text-xs text-center mt-2">
                <a
                  href={`${SCROLL_SEPOLIA_EXPLORER}/tx/${currentProof.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Ver en Scroll Sepolia Scan
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
          </div>

          <button
            onClick={() => setCurrentScreen('landing')}
            className="w-full mt-6 text-gray-400 hover:text-white py-2 text-sm transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
