import { Shield } from 'lucide-react';
import { useWeb3 } from './context/Web3Context';
import { SCROLL_SEPOLIA_NAME, SCROLL_SEPOLIA_EXPLORER, CONTRACT_ADDRESS } from './lib/contract';

function App() {
  const { account, isConnected, isConnecting, error, connect, disconnect, chainId } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-500 rounded-3xl p-4">
              <Shield className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">PrivyCredit</h1>
          <p className="text-xl text-gray-300 mb-2">Crédito sin destapar tu vida</p>
          <p className="text-sm text-blue-300">
            Funcionando en {SCROLL_SEPOLIA_NAME}
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 shadow-2xl">
          {!isConnected ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Conecta tu Wallet</h2>
              <p className="text-gray-400 mb-6">
                Conecta tu wallet para comenzar a usar PrivyCredit en {SCROLL_SEPOLIA_NAME}
              </p>
              {error && (
                <div className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-6">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              <button
                onClick={connect}
                disabled={isConnecting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Wallet Conectada</h2>
                  <p className="text-sm text-gray-400 font-mono">
                    {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Chain ID: {chainId}
                  </p>
                </div>
                <button
                  onClick={disconnect}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Desconectar
                </button>
              </div>

              <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-3">Próximos Pasos</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Generar prueba sellada de solvencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Compartir con prestamistas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Mantener tu privacidad protegida</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/50 rounded-2xl p-4">
                <p className="text-sm text-blue-200">
                  <strong>Nota:</strong> Esta es una demo funcional en {SCROLL_SEPOLIA_NAME}.
                  Los componentes completos se cargarán próximamente.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-400">
          <div className="mb-2">
            <a
              href={`${SCROLL_SEPOLIA_EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Contrato: {CONTRACT_ADDRESS.substring(0, 6)}...{CONTRACT_ADDRESS.substring(CONTRACT_ADDRESS.length - 4)}
            </a>
          </div>
          <p>PrivyCredit Demo - {SCROLL_SEPOLIA_NAME}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
