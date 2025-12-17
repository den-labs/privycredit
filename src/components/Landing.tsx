import { useEffect, useState } from 'react'
import {
  Wallet,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  SCROLL_SEPOLIA_NAME,
  SCROLL_SEPOLIA_EXPLORER,
  CONTRACT_ADDRESS,
} from '../lib/contract'
import heroMock from '../../assets/privycredit-hero.png'
import dashboardMock from '../../assets/privycredit-home.png'
import { AnimatedText, Badge, Button, Card } from './ui'

const heroCards = [
  {
    label: 'Estado',
    title: 'Apto para Crédito',
    meter: '92%',
    description:
      'Tu perfil on-chain cumple los parámetros del pool institucional.',
  },
  {
    label: 'Estado',
    title: 'Score en revisión',
    meter: '76%',
    description:
      'Algunas métricas pueden mejorar para acceder a mejores tasas.',
  },
  {
    label: 'Estado',
    title: 'Alto potencial',
    meter: '88%',
    description: 'Tu comportamiento on-chain es consistente en el tiempo.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Conecta',
    desc: 'Autorizas la lectura de señales en Scroll. No almacenamos saldos ni contrapartes.',
    icon: Wallet,
  },
  {
    step: '02',
    title: 'Genera',
    desc: 'Emitimos una prueba ZK que resume estabilidad, inflows y riesgo.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Comparte',
    desc: 'Solo compartes bandas (A/B/C) y estado final Apto/Casi.',
    icon: Lock,
  },
]

const testimonials = [
  {
    name: 'Equipo DeFi LATAM',
    quote:
      'Filtramos riesgo sin pedir KYC completo. Bajó la fricción y subió la calidad.',
  },
  {
    name: 'Desk institucional',
    quote:
      'Ofrecemos crédito con parámetros claros sin ver balances de usuario.',
  },
  {
    name: 'Builder anónimo',
    quote:
      'La reputación financiera privada es el puente real entre DeFi y TradFi.',
  },
]

export default function Landing() {
  const { setCurrentScreen } = useApp()
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % heroCards.length)
    }, 6500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-24 px-6">
      <section className="relative flex flex-col min-h-[80vh] pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none hero-bg-clip">
          <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-overlay" />
          <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16 relative z-10">
          <div className="space-y-8 hero-intro">
            <div className="hero-item hero-item-1">
              <Badge>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Protocolo v2.0 Live
              </Badge>
            </div>
            <div className="hero-item hero-item-2 text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight drop-shadow-lg">
                <AnimatedText text="Crédito sin" />
                <AnimatedText text="destapar tu vida" />
              </h1>
            </div>
            <p className="hero-item hero-item-3 text-lg text-blue-100/80 max-w-lg leading-relaxed border-l-2 border-blue-400/20 pl-6">
              PrivyCredit genera pruebas selladas en Scroll. Demuestras
              solvencia on-chain con Zero-Knowledge sin exponer montos ni
              contrapartes.
            </p>
            <div className="hero-item hero-item-4 flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={() => setCurrentScreen('connect')}
                className="!text-base !px-8 !py-4 shadow-blue-900/20"
              >
                Probar ahora
                <ArrowRight className="w-5 h-5 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentScreen('verifier')}
                className="!px-6"
              >
                Portal verificadores
              </Button>
            </div>
            <div className="hero-item hero-item-5 pt-8 border-t border-white/5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {[
                  {
                    label: 'Tiempo promedio',
                    value: '30s',
                    detail: 'Generar prueba',
                  },
                  {
                    label: 'Privacidad',
                    value: '100%',
                    detail: 'Montos sellados',
                  },
                  { label: 'Validez', value: '30 días', detail: 'Renovable' },
                ].map((metric) => (
                  <Card
                    key={metric.label}
                    className="!bg-[#0b1222]/70 border-white/5 shadow-none"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-blue-200/50 mb-2">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="text-xs text-blue-100/60">{metric.detail}</p>
                  </Card>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-200/50 uppercase tracking-widest mb-3">
                  Tecnología asegurada por
                </p>
                <div className="logo-marquee-container">
                  <div className="logo-marquee-track">
                    {['Scroll', 'Privy', 'Chainlink', 'ZK Stack'].map(
                      (partner) => (
                        <div
                          key={partner}
                          className="h-7 px-4 flex items-center text-sm font-semibold text-white/90 bg-white/5 rounded-full backdrop-blur-sm"
                        >
                          {partner}
                        </div>
                      ),
                    )}
                    {['Scroll', 'Privy', 'Chainlink', 'ZK Stack'].map(
                      (partner) => (
                        <div
                          key={`clone-${partner}`}
                          className="h-7 px-4 flex items-center text-sm font-semibold text-white/90 bg-white/5 rounded-full backdrop-blur-sm"
                        >
                          {partner}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-[2000px]">
            <div className="relative z-10 transform transition-transform duration-700 hover:rotate-y-[-2deg] hover:rotate-x-[2deg] hero-big-card">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur opacity-30" />
              <Card
                noPadding
                className="overflow-hidden aspect-[4/3] group cursor-default !bg-[#0f172a]/80 card-rotate"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/20 to-[#0f172a]/80 z-10 pointer-events-none" />
                <div
                  className="w-full h-full relative p-8 flex flex-col items-center justify-center bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  style={{ backgroundImage: `url(${heroMock})` }}
                >
                  <div className="absolute bottom-12 right-12 bg-gradient-to-br from-[#0b1226]/95 via-[#152743]/95 to-emerald-900/80 backdrop-blur-xl border border-emerald-300/30 p-4 rounded-xl shadow-2xl animate-float hero-card-content max-w-xs">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-400/35 ring-1 ring-emerald-200/40 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-200" />
                      </div>
                      <div>
                        <div className="text-xs text-cyan-200/80">
                          {heroCards[activeCard].label}
                        </div>
                        <div className="text-sm font-bold text-white">
                          {heroCards[activeCard].title}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-100/85 mb-4">
                      {heroCards[activeCard].description}
                    </p>
                    <div className="h-1.5 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 relative"
                        style={{ width: heroCards[activeCard].meter }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-40 animate-meter-shine" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative border-y border-white/5 bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge type="neutral">El Flujo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Privacidad en 3 pasos
            </h2>
            <p className="text-blue-100/70">
              El prestamista conoce que eres solvente, pero no tiene acceso a
              tus cifras exactas. Todo sucede dentro de tu dispositivo.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent border-t border-dashed border-white/10 z-0" />
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="relative z-10 group text-center px-4"
              >
                <div className="w-24 h-24 mx-auto bg-[#1e293b]/50 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:border-blue-400/50 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-300">
                  <item.icon className="w-10 h-10 text-blue-300 group-hover:text-blue-100 transition-colors" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 border-4 border-[#0f172a] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-blue-100/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/10 rounded-3xl border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 backdrop-blur-md shadow-2xl">
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Simulador de Crédito
            </h3>
            <p className="text-blue-100/70">
              Prueba escenarios antes de generar una solicitud real y entiende
              cómo tus hábitos impactan tu banda.
            </p>
            <ul className="space-y-3">
              {[
                'Análisis de saldo promedio',
                'Historial de liquidaciones',
                'Antigüedad de la wallet',
              ].map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 text-sm text-blue-200/80"
                >
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => setCurrentScreen('simulator')}
              className="!px-6 !py-3 !rounded-2xl w-fit"
            >
              Abrir simulador
            </Button>
          </div>
          <div className="flex-1 w-full perspective-[1000px]">
            <img
              src={dashboardMock}
              alt="PrivyCredit Dashboard Preview"
              className="rounded-xl border border-white/10 shadow-2xl w-full object-cover opacity-90 hover:opacity-100 transition-all transform rotate-y-[-5deg] hover:rotate-y-0 duration-500"
            />
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-black/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 text-center">
          <Badge type="success">Testimonios</Badge>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Builders usando <span className="text-blue-300">PrivyCredit</span>
          </h3>
          <p className="text-blue-100/70 max-w-2xl mx-auto text-sm md:text-base">
            Protocolos institucionales y equipos DeFi integran solvencia privada
            para mejorar onboarding.
          </p>
        </div>
        <div className="testimonial-marquee mt-12">
          <div className="testimonial-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <Card
                key={`${t.name}-${idx}`}
                className="min-w-[260px] max-w-xs mx-4 py-6 px-6 !bg-[#020617]/80 border-white/15"
              >
                <p className="text-sm text-blue-100/80 mb-4">“{t.quote}”</p>
                <span className="text-xs font-semibold text-blue-300">
                  {t.name}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full">
        <Card className="p-8 md:p-10 !bg-[#030712]/70 border-white/10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-3">
            <p className="text-xs uppercase tracking-[0.5em] text-blue-200/60">
              Contrato verificado
            </p>
            <h3 className="text-2xl font-semibold text-white">
              Scroll · {SCROLL_SEPOLIA_NAME}
            </h3>
            <p className="text-sm text-blue-100/70">
              Todas las pruebas se anclan en nuestro smart contract. Puedes
              revisarlo en el explorador cuando quieras.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-xs text-blue-100/80 w-full md:w-auto">
            <code className="text-sm font-mono bg-black/40 border border-white/10 rounded-full px-4 py-2 text-white text-center">
              {CONTRACT_ADDRESS.substring(0, 10)}...
              {CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 8)}
            </code>
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-blue-300 hover:text-white transition-colors text-sm"
            >
              Ver contrato
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Card>
      </section>
    </div>
  )
}
