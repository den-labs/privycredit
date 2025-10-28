import { useState } from 'react';
import { Wallet, ChevronLeft, Info, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWeb3 } from '../context/Web3Context';
import { supabase } from '../lib/supabase';

export default function ConnectWallet() {
  const { setCurrentScreen, setWalletConnected, setWalletAddress } = useApp();
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

      if (!account && !isConnecting) {
        throw new Error('No se pudo conectar la wallet');
      }

      const walletAddress = account!;

      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

      if (authError) throw authError;

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            wallet_address: walletAddress,
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;

        setWalletConnected(true);
        setWalletAddress(walletAddress);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <button
          onClick={() => setCurrentScreen('landing')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 rounded-2xl p-4">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3 text-center">
            Conecta tu wallet
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Para generar tu prueba sellada, necesitamos acceso a tu wallet
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  ¿Qué es una prueba sellada?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Es una verificación criptográfica que confirma que cumples ciertos criterios
                  sin revelar tus datos exactos. Como una carta sellada que el banco verifica
                  sin abrirla.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-slate-900">Permisos requeridos:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">
                  Leer historial de transacciones para calcular estabilidad
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">
                  Analizar bandas de ingresos sin mostrar montos exactos
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700">
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
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">
              Acepto generar una prueba sellada de solvencia sin compartir información personal
              identificable. He leído los{' '}
              <button className="text-blue-600 hover:underline">Términos</button> y la{' '}
              <button className="text-blue-600 hover:underline">Política de Privacidad</button>.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={!consent || isConnecting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            {isConnecting ? 'Conectando...' : 'Continuar'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-6">
            Tu información no sale en claro. Solo generamos bandas y umbrales.
          </p>
        </div>
      </div>
    </div>
  );
}
