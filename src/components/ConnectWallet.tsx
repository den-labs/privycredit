import { useState } from 'react';
import { Wallet, ChevronLeft, Info, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWeb3 } from '../context/Web3Context';

export default function ConnectWallet() {
  const { setCurrentScreen } = useApp();
  const { connect, account, isConnecting, error: web3Error } = useWeb3();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!consent) {
      setError('Debes aceptar los términos para continuar');
      return;
    }

    setError('');

    try {
      await connect();

      if (account) {
        setTimeout(() => {
          setCurrentScreen('generate');
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <button
          onClick={() => setCurrentScreen('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="bg-dark-card rounded-[2.5rem] shadow-xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary rounded-[2rem] p-4">
              <Wallet className="w-10 h-10 text-dark" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 text-center">
            Conecta tu wallet
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Para generar tu prueba sellada, necesitamos acceso a tu wallet
          </p>

          <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-2">
                  ¿Qué es una prueba sellada?
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Es una verificación criptográfica que confirma que cumples ciertos criterios
                  sin revelar tus datos exactos. Como una carta sellada que el banco verifica
                  sin abrirla.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-white">Permisos requeridos:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300">
                  Leer historial de transacciones para calcular estabilidad
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300">
                  Analizar bandas de ingresos sin mostrar montos exactos
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300">
                  Verificar ausencia de liquidaciones en protocolos DeFi
                </span>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setError('');
              }}
              className="mt-1 w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm text-gray-300">
              Acepto generar una prueba sellada de solvencia sin compartir información personal
              identificable. He leído los{' '}
              <button className="text-primary hover:underline">Términos</button> y la{' '}
              <button className="text-primary hover:underline">Política de Privacidad</button>.
            </span>
          </label>

          {(error || web3Error) && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-400">{error || web3Error}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={!consent || isConnecting}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-700 disabled:cursor-not-allowed text-dark disabled:text-gray-500 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            {isConnecting ? 'Conectando...' : 'Continuar'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-6">
            Tu información no sale en claro. Solo generamos bandas y umbrales.
          </p>
        </div>
      </div>
    </div>
  );
}
