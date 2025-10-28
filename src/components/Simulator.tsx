import { useState } from 'react';
import { ChevronLeft, RotateCcw, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BandLevel } from '../types';

const bandOptions: BandLevel[] = ['A', 'B', 'C'];

const getBandColor = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'bg-emerald-500 hover:bg-emerald-600';
    case 'B':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'C':
      return 'bg-red-500 hover:bg-red-600';
  }
};

const calculateStatus = (estabilidad: BandLevel, inflows: BandLevel, riesgo: BandLevel) => {
  if (estabilidad === 'A' && inflows === 'A' && riesgo === 'A') {
    return 'apto';
  }
  return 'casi';
};

export default function Simulator() {
  const { currentProof, setCurrentScreen } = useApp();

  const [estabilidad, setEstabilidad] = useState<BandLevel>(
    currentProof?.factors.estabilidad || 'B'
  );
  const [inflows, setInflows] = useState<BandLevel>(currentProof?.factors.inflows || 'B');
  const [riesgo, setRiesgo] = useState<BandLevel>(currentProof?.factors.riesgo || 'B');

  const status = calculateStatus(estabilidad, inflows, riesgo);

  const reset = () => {
    if (currentProof) {
      setEstabilidad(currentProof.factors.estabilidad);
      setInflows(currentProof.factors.inflows);
      setRiesgo(currentProof.factors.riesgo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <button
          onClick={() =>
            setCurrentScreen(currentProof?.status === 'apto' ? 'result-apto' : 'result-casi')
          }
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 rounded-xl p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Simulador de bandas</h1>
          </div>

          <p className="text-slate-600 mb-8">
            Ajusta las bandas para ver cómo cambiaría tu resultado
          </p>

          <div
            className={`rounded-2xl p-6 mb-8 text-center ${
              status === 'apto'
                ? 'bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-300'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300'
            }`}
          >
            <h2 className="text-sm font-semibold text-slate-600 mb-2">Resultado simulado</h2>
            <p
              className={`text-4xl font-bold ${
                status === 'apto' ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {status === 'apto' ? '¡Apto!' : 'Casi...'}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Estabilidad
              </label>
              <div className="flex gap-2">
                {bandOptions.map((band) => (
                  <button
                    key={band}
                    onClick={() => setEstabilidad(band)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                      estabilidad === band
                        ? `${getBandColor(band)} ring-4 ring-offset-2 ${
                            band === 'A'
                              ? 'ring-emerald-200'
                              : band === 'B'
                              ? 'ring-amber-200'
                              : 'ring-red-200'
                          }`
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Banda {band}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {estabilidad === 'A' && 'Wallet activa +6 meses con continuidad'}
                {estabilidad === 'B' && 'Wallet activa 3-6 meses'}
                {estabilidad === 'C' && 'Wallet activa <3 meses o con gaps'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Ingresos</label>
              <div className="flex gap-2">
                {bandOptions.map((band) => (
                  <button
                    key={band}
                    onClick={() => setInflows(band)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                      inflows === band
                        ? `${getBandColor(band)} ring-4 ring-offset-2 ${
                            band === 'A'
                              ? 'ring-emerald-200'
                              : band === 'B'
                              ? 'ring-amber-200'
                              : 'ring-red-200'
                          }`
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Banda {band}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {inflows === 'A' && 'Inflows regulares y consistentes'}
                {inflows === 'B' && 'Inflows moderados con variación'}
                {inflows === 'C' && 'Inflows irregulares o bajos'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Riesgo</label>
              <div className="flex gap-2">
                {bandOptions.map((band) => (
                  <button
                    key={band}
                    onClick={() => setRiesgo(band)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                      riesgo === band
                        ? `${getBandColor(band)} ring-4 ring-offset-2 ${
                            band === 'A'
                              ? 'ring-emerald-200'
                              : band === 'B'
                              ? 'ring-amber-200'
                              : 'ring-red-200'
                          }`
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Banda {band}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {riesgo === 'A' && 'Sin liquidaciones, drawdown <15%'}
                {riesgo === 'B' && 'Drawdown 15-30%, riesgo moderado'}
                {riesgo === 'C' && 'Liquidaciones o drawdown >30%'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Nota educativa</h3>
            <p className="text-sm text-slate-700">
              Este simulador muestra cómo las mejoras en cada banda afectan tu resultado.
              Los valores exactos permanecen privados. Para llegar a Apto, todas las bandas
              deben estar en nivel A.
            </p>
          </div>

          <button
            onClick={reset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Restablecer valores originales
          </button>
        </div>
      </div>
    </div>
  );
}
