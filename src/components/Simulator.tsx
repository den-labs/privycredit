import { useState } from 'react';
import { TrendingUp, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BandLevel } from '../types';

type SimulatedFactors = {
  estabilidad: BandLevel;
  inflows: BandLevel;
  riesgo: BandLevel;
};

const bandOptions: BandLevel[] = ['A', 'B', 'C'];

const getBandColor = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'bg-green-500';
    case 'B':
      return 'bg-yellow-500';
    case 'C':
      return 'bg-red-500';
  }
};

const calculateStatus = (factors: SimulatedFactors): 'apto' | 'casi' => {
  const scores = {
    A: 3,
    B: 2,
    C: 1,
  };

  const totalScore =
    scores[factors.estabilidad] + scores[factors.inflows] + scores[factors.riesgo];

  return totalScore >= 8 ? 'apto' : 'casi';
};

export default function Simulator() {
  const { currentProof, setCurrentScreen } = useApp();
  const [factors, setFactors] = useState<SimulatedFactors>({
    estabilidad: currentProof?.factors.estabilidad || 'B',
    inflows: currentProof?.factors.inflows || 'B',
    riesgo: currentProof?.factors.riesgo || 'C',
  });

  const status = calculateStatus(factors);

  const handleReset = () => {
    if (currentProof) {
      setFactors(currentProof.factors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex bg-secondary/30 rounded-full p-6 mb-4">
            <TrendingUp className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-3">Simulador de bandas</h1>
          <p className="text-dark">
            Explora cómo las mejoras afectan tu evaluación
          </p>
        </div>

        <div className="bg-light-card/80 backdrop-blur-sm rounded-3xl border border-light-border shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-dark mb-2">Resultado simulado</h2>
              <div className="flex items-center gap-2">
                {status === 'apto' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-semibold">Apto</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-600 font-semibold">Casi</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-dark-muted hover:text-dark transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Resetear</span>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-dark mb-1">Estabilidad</h3>
                  <p className="text-xs text-dark-muted">Consistencia de saldos</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getBandColor(factors.estabilidad)}`}>
                  Banda {factors.estabilidad}
                </span>
              </div>
              <div className="flex gap-2">
                {bandOptions.map((band) => (
                  <button
                    key={band}
                    onClick={() => setFactors({ ...factors, estabilidad: band })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      factors.estabilidad === band
                        ? `${getBandColor(band)} text-white`
                        : 'bg-light border border-light-border text-dark-muted hover:bg-secondary/20'
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-dark mb-1">Inflows</h3>
                  <p className="text-xs text-dark-muted">Ingresos recurrentes</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getBandColor(factors.inflows)}`}>
                  Banda {factors.inflows}
                </span>
              </div>
              <div className="flex gap-2">
                {bandOptions.map((band) => (
                  <button
                    key={band}
                    onClick={() => setFactors({ ...factors, inflows: band })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      factors.inflows === band
                        ? `${getBandColor(band)} text-white`
                        : 'bg-light border border-light-border text-dark-muted hover:bg-secondary/20'
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-dark mb-1">Riesgo</h3>
                  <p className="text-xs text-dark-muted">Gestión de volatilidad</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getBandColor(factors.riesgo)}`}>
                  Banda {factors.riesgo}
                </span>
              </div>
              <div className="flex gap-2">
                {bandOptions.map((band) => (
                  <button
                    key={band}
                    onClick={() => setFactors({ ...factors, riesgo: band })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                      factors.riesgo === band
                        ? `${getBandColor(band)} text-white`
                        : 'bg-light border border-light-border text-dark-muted hover:bg-secondary/20'
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-8 rounded-xl p-4 border ${
            status === 'apto'
              ? 'bg-green-50 border-green-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <p className={`text-sm ${status === 'apto' ? 'text-green-700' : 'text-yellow-700'}`}>
              {status === 'apto'
                ? 'Con estas bandas alcanzarías el estado "Apto". Trabaja en mejorar tus factores para lograrlo.'
                : 'Con estas bandas aún estarías en "Casi". Intenta mejorar más factores a banda A.'}
            </p>
          </div>
        </div>

        <div className="bg-secondary/20 border border-accent/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-dark text-sm">
            <strong>Nota educativa:</strong> Esta simulación no usa tus datos reales,
            solo muestra cómo el modelo evalúa diferentes combinaciones de bandas.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('result-casi')}
          className="text-dark-muted hover:text-dark text-sm transition-colors mx-auto block"
        >
          ← Volver a resultados
        </button>
      </div>
    </div>
  );
}
