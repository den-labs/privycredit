import { ChevronLeft, TrendingUp, Download, Bell, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Improvement } from '../types';

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'alto':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'medio':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'bajo':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export default function ImprovementChecklist() {
  const { currentProof, setCurrentScreen } = useApp();

  if (!currentProof) {
    return null;
  }

  const improvements: Improvement[] = [];

  if (currentProof.factors.estabilidad !== 'A') {
    improvements.push({
      title: 'Mejorar estabilidad de wallet',
      description: 'Mantén tu wallet activa y con transacciones por +1 mes consecutivo',
      impact: 'alto',
    });
  }

  if (currentProof.factors.inflows !== 'A') {
    improvements.push({
      title: 'Aumentar frecuencia de ingresos',
      description: 'Recibe pagos de forma más regular para mejorar tu banda de inflows',
      impact: 'alto',
    });
  }

  if (currentProof.factors.riesgo !== 'A') {
    improvements.push({
      title: 'Reducir volatilidad de saldo',
      description: 'Evita drawdowns mayores al 30% manteniendo un saldo más estable',
      impact: 'medio',
    });
  }

  improvements.push({
    title: 'Mantener historial limpio',
    description: 'Evita liquidaciones en protocolos DeFi para mantener bajo riesgo',
    impact: 'medio',
  });

  improvements.push({
    title: 'Diversificar fuentes de ingreso',
    description: 'Recibe pagos de múltiples fuentes para demostrar mayor estabilidad',
    impact: 'bajo',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <button
          onClick={() => setCurrentScreen('result-casi')}
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
            <h1 className="text-3xl font-bold text-slate-900">Plan de mejora</h1>
          </div>

          <p className="text-slate-600 mb-8">
            Sigue estos pasos para mejorar tu resultado y llegar a Apto
          </p>

          <div className="space-y-4 mb-8">
            {improvements.map((improvement, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white border-2 border-slate-300 rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">{improvement.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${getImpactColor(
                          improvement.impact
                        )}`}
                      >
                        Impacto {improvement.impact}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {improvement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Consejo motivador</h3>
            <p className="text-sm text-slate-700">
              Cada mejora te acerca a la aprobación. No necesitas hacerlo todo de una vez.
              Enfócate en los cambios de alto impacto primero y revisa tu progreso en 30 días.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentScreen('reminders')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Activar recordatorio
            </button>

            <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
