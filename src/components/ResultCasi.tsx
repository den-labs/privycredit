import { AlertCircle, TrendingUp, Bell, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

const improvements = [
  {
    factor: 'Estabilidad',
    action: '+1 mes de continuidad en saldos',
    impact: 'Alto',
  },
  {
    factor: 'Inflows',
    action: 'Aumentar frecuencia de depósitos',
    impact: 'Medio',
  },
  {
    factor: 'Riesgo',
    action: 'Mantener saldo dentro de banda estable',
    impact: 'Alto',
  },
];

export default function ResultCasi() {
  const { currentProof, setCurrentScreen } = useApp();

  if (!currentProof) {
    setCurrentScreen('landing');
    return null;
  }

  return (
    <div className="page-section">
      <div className="section-shell max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-amber-400/40 bg-amber-500/10 p-6">
            <AlertCircle className="w-16 h-16 text-amber-300" />
          </div>
          <h1 className="text-4xl font-semibold text-white">Casi allí</h1>
          <p className="text-dark-muted text-lg">Estás cerca de cumplir todos los criterios.</p>
        </div>

        <div className="glass-panel p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white">Tu evaluación actual</h2>
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
          <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            Mejorando algunos factores podrías alcanzar el estado “Apto” pronto.
          </div>
        </div>

        <div className="glass-panel p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Mejoras sugeridas</h2>
            <p className="text-dark-muted text-sm">Estos cambios te acercarán a una evaluación “Apto”:</p>
          </div>
          <div className="space-y-3">
            {improvements.map((item) => (
              <div key={item.factor} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{item.factor}</h3>
                  <span className={`chip ${item.impact === 'Alto' ? 'chip-positive' : 'chip-alert'}`}>
                    Impacto {item.impact}
                  </span>
                </div>
                <p className="text-sm text-dark-muted">{item.action}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <button onClick={() => setCurrentScreen('simulator')} className="btn-primary w-full">
              <TrendingUp className="w-5 h-5" />
              Abrir simulador
            </button>

            <button onClick={() => setCurrentScreen('reminders')} className="btn-secondary w-full">
              <Bell className="w-5 h-5" />
              Recordarme
            </button>
          </div>
        </div>

        <div className="glass-panel p-6">
          <button
            onClick={() => setCurrentScreen('checklist')}
            className="flex w-full items-center justify-between text-white"
          >
            <span className="font-medium">Ver lista de mejoras completa</span>
            <Eye className="w-5 h-5" />
          </button>
        </div>

        <div className="glass-panel p-4 text-center text-sm text-dark-muted border-white/10 bg-white/5">
          <strong className="text-white">Tu privacidad está protegida.</strong> Estos datos solo los ves tú.
        </div>

        <button onClick={() => setCurrentScreen('landing')} className="btn-ghost mx-auto">
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}
