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

  const handleSelect = (key: keyof SimulatedFactors, band: BandLevel) => {
    setFactors((prev) => ({
      ...prev,
      [key]: band,
    }));
  };

  return (
    <div className="page-section">
      <div className="section-shell max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-6">
            <TrendingUp className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Simulador de bandas</h1>
          <p className="text-dark-muted">Explora cómo las mejoras afectan tu evaluación.</p>
        </div>

        <div className="glass-panel p-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Resultado simulado</h2>
              <div className="flex items-center gap-2 text-sm font-semibold">
                {status === 'apto' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-green-200">Apto</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200">Casi</span>
                  </>
                )}
              </div>
            </div>
            <button onClick={handleReset} className="btn-ghost">
              <RotateCcw className="w-4 h-4" />
              Resetear
            </button>
          </div>

          <div className="space-y-6">
            {([
              { key: 'estabilidad', label: 'Estabilidad', description: 'Consistencia de saldos' },
              { key: 'inflows', label: 'Inflows', description: 'Ingresos recurrentes' },
              { key: 'riesgo', label: 'Riesgo', description: 'Gestión de volatilidad' },
            ] as const).map((factor) => (
              <div key={factor.key}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{factor.label}</h3>
                    <p className="text-xs text-dark-muted">{factor.description}</p>
                  </div>
                  <span className="band-pill" data-tone={factors[factor.key]}>
                    Banda {factors[factor.key]}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {bandOptions.map((band) => (
                    <button
                      key={band}
                      onClick={() => handleSelect(factor.key, band)}
                      className={`rounded-2xl border px-4 py-2 font-semibold transition ${
                        factors[factor.key] === band
                          ? 'border-white/40 bg-white/10 text-white'
                          : 'border-white/10 bg-white/5 text-dark-muted hover:border-white/30'
                      }`}
                    >
                      {band}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-3xl border p-4 text-sm ${
              status === 'apto'
                ? 'border-green-400/40 bg-green-500/10 text-green-100'
                : 'border-amber-400/40 bg-amber-500/10 text-amber-100'
            }`}
          >
            {status === 'apto'
              ? 'Con estas bandas alcanzarías el estado “Apto”. Trabaja en mantenerlas para consolidarlo.'
              : 'Con estas bandas aún estarías en “Casi”. Lleva más factores a banda A para avanzar.'}
          </div>
        </div>

        <div className="glass-panel p-4 text-center text-sm text-dark-muted">
          <strong className="text-white">Nota educativa:</strong> Esta simulación es ilustrativa; no usa tus datos en claro.
        </div>

        <button onClick={() => setCurrentScreen('result-casi')} className="btn-ghost mx-auto">
          ← Volver a resultados
        </button>
      </div>
    </div>
  );
}
