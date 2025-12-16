import { CheckSquare, TrendingUp, Save, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

const improvements = [
  {
    id: 1,
    factor: 'Estabilidad',
    action: 'Mantener saldo mínimo durante +30 días consecutivos',
    impact: 'Alto',
    description: 'Evita caídas bruscas en tu saldo para demostrar estabilidad financiera',
  },
  {
    id: 2,
    factor: 'Inflows',
    action: 'Incrementar frecuencia de ingresos a semanal',
    impact: 'Alto',
    description: 'Depósitos más frecuentes indican flujos de ingreso consistentes',
  },
  {
    id: 3,
    factor: 'Riesgo',
    action: 'Reducir volatilidad de saldo en 20%',
    impact: 'Medio',
    description: 'Mantén tu saldo dentro de un rango estable sin grandes fluctuaciones',
  },
];

export default function ImprovementChecklist() {
  const { setCurrentScreen } = useApp();

  return (
    <div className="page-section">
      <div className="section-shell max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-green-400/40 bg-green-500/10 p-6">
            <CheckSquare className="w-16 h-16 text-green-300" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Plan de mejora</h1>
          <p className="text-dark-muted">Acciones prioritarias para alcanzar el estado “Apto”.</p>
        </div>

        <div className="glass-panel p-8 space-y-8">
          <div className="space-y-4">
            {improvements.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h3 className="text-white font-semibold">{item.factor}</h3>
                  <span className={`chip ${item.impact === 'Alto' ? 'chip-positive' : 'chip-alert'}`}>
                    Impacto {item.impact}
                  </span>
                </div>
                <p className="text-white mb-2">{item.action}</p>
                <p className="text-sm text-dark-muted">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-dark-muted">
            <strong className="text-white">Enfoque incremental:</strong> Prioriza las acciones de alto impacto para ver
            resultados más rápido.
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button className="btn-primary w-full">
              <Save className="w-5 h-5" />
              Guardar plan
            </button>
            <button onClick={() => setCurrentScreen('reminders')} className="btn-secondary w-full">
              <Bell className="w-5 h-5" />
              Activar recordatorio
            </button>
          </div>
        </div>

        <div className="glass-panel p-6">
          <button
            onClick={() => setCurrentScreen('simulator')}
            className="flex w-full items-center justify-between text-white"
          >
            <span className="font-medium">Simular impacto de mejoras</span>
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>

        <button onClick={() => setCurrentScreen('result-casi')} className="btn-ghost mx-auto">
          ← Volver a resultados
        </button>
      </div>
    </div>
  );
}
