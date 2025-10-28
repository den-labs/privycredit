import { Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_NAME, SCROLL_SEPOLIA_EXPLORER } from '../lib/contract';

export default function Landing() {
  const { setCurrentScreen } = useApp();

  return (
    <>
      <div className="bg-blue-900/30 border-b border-blue-500/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-blue-300">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">
              Esta demo funciona en <strong>{SCROLL_SEPOLIA_NAME}</strong>.
              <a
                href={SCROLL_SEPOLIA_EXPLORER}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white ml-1"
              >
                Ver explorador
              </a>
            </p>
          </div>
        </div>
      </div>
    <div className="min-h-screen bg-dark">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary rounded-[2.5rem] p-4">
              <Shield className="w-12 h-12 text-dark" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Crédito sin destapar tu vida
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Demuestra que eres buen pagador con pruebas selladas. Tu información permanece privada.
          </p>
          <button
            onClick={() => setCurrentScreen('connect')}
            className="bg-primary hover:bg-primary-dark text-dark px-12 py-5 rounded-full text-lg font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:scale-105"
          >
            Probar ahora
          </button>
        </div>

        <div className="bg-dark-card rounded-[2.5rem] border border-dark-border shadow-2xl p-8 sm:p-12 mb-16">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-dark border-2 border-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Conecta</h3>
              <p className="text-gray-400">
                Conecta tu wallet y autoriza la generación de tu prueba sellada
              </p>
            </div>
            <div className="text-center">
              <div className="bg-dark border-2 border-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Genera prueba</h3>
              <p className="text-gray-400">
                Creamos una prueba sellada sin exponer tus números
              </p>
            </div>
            <div className="text-center">
              <div className="bg-dark border-2 border-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Obtén respuesta</h3>
              <p className="text-gray-400">
                Recibe tu resultado y compártelo con prestamistas
              </p>
            </div>
          </div>
        </div>

        <div className="gradient-card rounded-[2.5rem] shadow-2xl p-8 sm:p-12 text-white mb-16 border border-primary/20">
          <div className="flex items-start gap-4 mb-8">
            <Lock className="w-8 h-8 flex-shrink-0 mt-1 text-primary" />
            <div>
              <h3 className="text-2xl font-bold mb-3">Privacidad primero</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Compartimos bandas y umbrales, no montos. Tu información sensible nunca sale en claro.
                Solo mostramos si cumples los criterios, sin revelar tus datos personales.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-card rounded-[2.5rem] border border-dark-border shadow-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Aliados de confianza
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-gray-500 font-semibold">Cooperativa A</div>
            <div className="text-gray-500 font-semibold">Fintech B</div>
            <div className="text-gray-500 font-semibold">Banco C</div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-primary">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">No vemos tus números</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
