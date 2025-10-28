import { Shield, Lock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { setCurrentScreen } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 rounded-2xl p-3">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Crédito sin destapar tu vida
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Demuestra que eres buen pagador con pruebas selladas. Tu información permanece privada.
          </p>
          <button
            onClick={() => setCurrentScreen('connect')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Probar ahora
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Cómo funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Conecta</h3>
              <p className="text-slate-600">
                Conecta tu wallet y autoriza la generación de tu prueba sellada
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Genera prueba</h3>
              <p className="text-slate-600">
                Creamos una prueba sellada sin exponer tus números
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Obtén respuesta</h3>
              <p className="text-slate-600">
                Recibe tu resultado y compártelo con prestamistas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-xl p-8 sm:p-12 text-white mb-16">
          <div className="flex items-start gap-4 mb-8">
            <Lock className="w-8 h-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3">Privacidad primero</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Compartimos bandas y umbrales, no montos. Tu información sensible nunca sale en claro.
                Solo mostramos si cumples los criterios, sin revelar tus datos personales.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Aliados de confianza
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-slate-400 font-semibold">Cooperativa A</div>
            <div className="text-slate-400 font-semibold">Fintech B</div>
            <div className="text-slate-400 font-semibold">Banco C</div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">No vemos tus números</span>
          </div>
        </div>
      </div>
    </div>
  );
}
