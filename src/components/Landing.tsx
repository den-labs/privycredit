import { Shield, Lock, CheckCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_NAME, SCROLL_SEPOLIA_EXPLORER, CONTRACT_ADDRESS } from '../lib/contract';

export default function Landing() {
  const { setCurrentScreen } = useApp();

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-card to-dark">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">

        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-accent to-primary-dark rounded-[2.5rem] p-6 shadow-2xl">
            <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-dark" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-light mb-4 leading-tight">
            PrivyCredit
          </h1>
          <p className="text-xl sm:text-2xl text-light mb-2">
            Crédito sin destapar tu vida
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Demuestra tu solvencia sin revelar montos ni contrapartes.
            Una prueba sellada que protege tu privacidad.
          </p>
        </div>

        <div className="text-center mb-16">
          <button
            onClick={() => setCurrentScreen('connect')}
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-primary-dark text-dark px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Probar ahora
          </button>
        </div>

        <div className="bg-dark-card/50 backdrop-blur-sm rounded-[2.5rem] border border-dark-border shadow-2xl p-8 sm:p-12 mb-12">
          <h2 className="text-2xl font-bold text-light mb-8 text-center">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/20 border border-accent/50 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="font-semibold text-light mb-2 text-lg">Conecta</h3>
              <p className="text-gray-400 text-sm">
                Vincula tu wallet para analizar tus señales on-chain
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/20 border border-accent/50 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="font-semibold text-light mb-2 text-lg">Genera prueba</h3>
              <p className="text-gray-400 text-sm">
                Creamos una prueba sellada sin exponer tus datos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/20 border border-accent/50 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="font-semibold text-light mb-2 text-lg">Obtén respuesta</h3>
              <p className="text-gray-400 text-sm">
                Comparte con prestamistas o mejora tu perfil
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-dark-card/50 backdrop-blur-sm rounded-3xl border border-dark-border p-8">
            <Lock className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-light mb-3">
              Privacidad total
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tus montos, contrapartes y actividad permanecen privados.
              Solo compartimos bandas de evaluación sin revelar información sensible.
            </p>
          </div>

          <div className="bg-dark-card/50 backdrop-blur-sm rounded-3xl border border-dark-border p-8">
            <CheckCircle className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-light mb-3">
              Prueba verificable
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cada prueba se registra en blockchain y puede ser verificada
              por prestamistas sin necesidad de revelar tu información personal.
            </p>
          </div>
        </div>

        <div className="bg-dark-card/50 backdrop-blur-sm rounded-[2.5rem] border border-dark-border shadow-2xl p-8 sm:p-12 mb-16">
          <h2 className="text-2xl font-bold text-light mb-6 text-center">
            Aliados de confianza
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-gray-500 font-semibold">Cooperativa A</div>
            <div className="text-gray-500 font-semibold">Fintech B</div>
            <div className="text-gray-500 font-semibold">Banco C</div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">No vemos tus números</span>
          </div>
        </div>

        <div className="bg-dark-card/50 border border-accent/20 rounded-2xl p-6 text-center">
          <h3 className="text-sm font-semibold text-light mb-3">Smart Contract Verificado</h3>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield className="w-4 h-4 text-accent" />
            <code className="text-xs bg-dark-card px-2 py-1 rounded">
              {CONTRACT_ADDRESS.substring(0, 10)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 8)}
            </code>
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center gap-1"
            >
              Ver contrato
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-2">Desplegado en {SCROLL_SEPOLIA_NAME}</p>
        </div>
      </div>
    </div>
    </>
  );
}
