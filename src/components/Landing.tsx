import { Shield, Lock, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_NAME, SCROLL_SEPOLIA_EXPLORER, CONTRACT_ADDRESS } from '../lib/contract';
import heroMock from '../../assets/privycredit-hero.png';
import dashboardMock from '../../assets/privycredit-home.png';

export default function Landing() {
  const { setCurrentScreen } = useApp();

  const steps = [
    { title: 'Conecta', description: 'Analizamos tus señales on-chain únicamente con tu autorización.' },
    { title: 'Genera prueba', description: 'Creamos una verificación ZK sellada y anclada en Scroll.' },
    { title: 'Comparte', description: 'Solo compartes bandas (A/B/C) y estado Apto/Casi.' },
  ];

  return (
    <div className="page-section">
      <div className="section-shell space-y-16">
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="tag-pill w-fit">
              <Shield className="w-4 h-4" />
              PrivyCredit · Scroll
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
                Evalúa solvencia con estética fintech premium.
              </h1>
              <p className="text-lg text-dark-muted">
                PrivyCredit genera pruebas selladas que mantienen tus cifras fuera del alcance de terceros.
                El flujo sigue intacto: conectas wallet, autorizar, generas y compartes resultados listos para prestamistas.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setCurrentScreen('connect')} className="btn-primary">
                Probar ahora
              </button>
              <button onClick={() => setCurrentScreen('verifier')} className="btn-secondary">
                Portal verificadores
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="stat-card">
                <p className="text-dark-subtle uppercase text-xs mb-1">Tiempo promedio</p>
                <p className="text-2xl font-semibold text-white">30s</p>
                <p className="text-dark-muted text-xs">Generar prueba</p>
              </div>
              <div className="stat-card">
                <p className="text-dark-subtle uppercase text-xs mb-1">Privacidad</p>
                <p className="text-2xl font-semibold text-white">100%</p>
                <p className="text-dark-muted text-xs">Montos sellados</p>
              </div>
              <div className="stat-card">
                <p className="text-dark-subtle uppercase text-xs mb-1">Validez</p>
                <p className="text-2xl font-semibold text-white">30 días</p>
                <p className="text-dark-muted text-xs">Renovable</p>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="hero-visual h-[420px] sm:h-[520px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-secondary/25" />
              <img src={heroMock} alt="PrivyCredit hero" loading="lazy" />
            </div>
            <div className="absolute -bottom-10 -right-6 w-2/3 h-40 sm:h-44">
              <div className="hero-visual h-full w-full border border-white/20 shadow-[0_20px_60px_rgba(4,6,13,0.7)]">
                <img src={dashboardMock} alt="Flujo PrivyCredit" className="object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel p-8 sm:p-12 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm text-dark-muted uppercase tracking-[0.5em]">Flujo intacto</p>
            <h2 className="text-3xl font-semibold text-white">Cómo funciona</h2>
            <p className="text-dark-muted">
              El mismo journey, con una interfaz refinada: conecta, autoriza, genera y comparte.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-3xl border border-white/20 bg-white/5 flex items-center justify-center text-xl font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-dark-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="glass-panel p-8 space-y-4">
            <div className="chip chip-positive w-fit">
              <Lock className="w-4 h-4" />
              Privacidad total
            </div>
            <h3 className="text-2xl font-semibold text-white">Nada de montos, solo bandas.</h3>
            <p className="text-dark-muted leading-relaxed">
              Tus contrapartes, inflows y saldos permanecen privados. Compartes únicamente rangos e indicadores
              que los prestamistas necesitan para tomar decisiones.
            </p>
          </div>
          <div className="glass-panel p-8 space-y-4">
            <div className="chip chip-positive w-fit">
              <CheckCircle className="w-4 h-4" />
              Verificable on-chain
            </div>
            <h3 className="text-2xl font-semibold text-white">Registro auditable en Scroll Sepolia.</h3>
            <p className="text-dark-muted leading-relaxed">
              Cada prueba se ancla en nuestro contrato. Los prestamistas pueden verificar su validez con un clic,
              sin exponer tus datos personales.
            </p>
          </div>
        </section>

        <section className="glass-panel p-8 sm:p-12 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm text-dark-muted uppercase tracking-[0.5em]">Aliados</p>
            <h2 className="text-3xl font-semibold text-white">Confían en pruebas selladas</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {['Cooperativa A', 'Fintech B', 'Banco C'].map((ally) => (
              <div key={ally} className="rounded-3xl border border-white/10 bg-white/5 py-6 px-4 font-semibold text-dark-subtle">
                {ally}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 text-sm text-dark-muted">
            <CheckCircle className="w-4 h-4 text-accent" />
            No almacenamos cifras ni contrapartes.
          </div>
        </section>

        <section className="glass-panel p-6 sm:p-8 text-center space-y-3">
          <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-[0.4em]">
            Smart Contract Verificado
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-dark-muted text-sm">
            <Shield className="w-4 h-4 text-accent" />
            <code className="text-xs bg-black/40 border border-white/10 rounded-full px-3 py-1">
              {CONTRACT_ADDRESS.substring(0, 10)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 8)}
            </code>
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:text-white transition-colors"
            >
              Ver contrato
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-dark-subtle">Desplegado en {SCROLL_SEPOLIA_NAME}</p>
        </section>
      </div>
    </div>
  );
}
