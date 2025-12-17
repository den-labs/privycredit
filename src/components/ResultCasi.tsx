import { AlertCircle, TrendingUp, Bell, Eye, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Badge, Button, Card } from './ui';

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

  const factors = [
    { label: 'Estabilidad', description: 'Consistencia de saldos', value: currentProof.factors.estabilidad },
    { label: 'Inflows', description: 'Ingresos recurrentes', value: currentProof.factors.inflows },
    { label: 'Riesgo', description: 'Gestión de volatilidad', value: currentProof.factors.riesgo },
  ];

  return (
    <div className="px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge type="warning" className="mx-auto">
            Ajustes recomendados
          </Badge>
          <h1 className="text-4xl font-semibold text-white">Aún no eres apto</h1>
          <p className="text-amber-100/80 text-lg">Pequeños ajustes pueden empujarte al estado “Apto”.</p>
        </div>

        <Card className="!border-amber-500/20 !bg-[#451a03]/80 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_#F59E0B]" />
          <div className="pt-10 pb-6 px-4 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6 relative">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Tu score está en revisión</h2>
              <p className="text-amber-100/70 text-sm px-6">
                Puedes mejorar tus bandas enfocándote en estabilidad y flujo de entrada.
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-6 border border-amber-500/10 text-left mx-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-amber-500 rotate-12" />
              </div>
              <h4 className="text-white font-medium mb-4 flex items-center gap-2 relative z-10">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                Cómo mejorar tu score
              </h4>
              <ul className="space-y-3 text-sm text-amber-100/70 relative z-10">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Incrementa el volumen de transacciones en Scroll.
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  Mantén un saldo promedio superior a 0.05 ETH durante 30 días.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Tu evaluación actual</h2>
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
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            Mejorando algunos factores podrás alcanzar el estado “Apto”.
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Mejoras sugeridas</h2>
            <p className="text-blue-100/70 text-sm">Estos ajustes tienen impacto directo en tu banda.</p>
          </div>
          <div className="space-y-3">
            {improvements.map((item) => (
              <div key={item.factor} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{item.factor}</h3>
                  <span className={`chip ${item.impact === 'Alto' ? 'chip-positive' : 'chip-alert'}`}>
                    Impacto {item.impact}
                  </span>
                </div>
                <p className="text-sm text-blue-100/70">{item.action}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button onClick={() => setCurrentScreen('simulator')} className="w-full justify-center">
              <TrendingUp className="w-5 h-5" />
              Abrir simulador
            </Button>
            <Button variant="secondary" onClick={() => setCurrentScreen('reminders')} className="w-full justify-center">
              <Bell className="w-5 h-5" />
              Recordarme
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Lista completa de acciones sugeridas</p>
            <p className="text-xs text-blue-100/70">Prioriza cambios en tu ritmo on-chain.</p>
          </div>
          <Button variant="ghost" onClick={() => setCurrentScreen('checklist')} className="text-blue-200/80">
            Ver checklist
            <Eye className="w-4 h-4" />
          </Button>
        </Card>

        <Card className="text-center text-sm text-blue-100/70">
          <strong className="text-white">Tu privacidad permanece intacta.</strong> Solo tú ves estos datos.
        </Card>

        <Button variant="ghost" onClick={() => setCurrentScreen('landing')} className="mx-auto text-blue-200/80">
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}
