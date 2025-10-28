import { useState } from 'react';
import { Shield, QrCode, Search, AlertCircle, ExternalLink } from 'lucide-react';
import { publicClient, CONTRACT_ADDRESS, CONTRACT_ABI, bandToBandLevel } from '../lib/contract';
import { Proof } from '../types';

interface VerificationResult {
  proof: any;
  onChainValid: boolean;
}

export default function VerifierGate() {
  const [proofId, setProofId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!proofId.trim()) {
      setError('Por favor ingresa un ID de prueba');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const contractProof = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProofSummary',
        args: [proofId as `0x${string}`],
      });

      const [user, epoch, commitment, stability, inflows, risk, valid, createdAt] = contractProof;

      if (!valid) {
        setError('Esta prueba no es válida o ha sido revocada.');
        setLoading(false);
        return;
      }

      const proof = {
        id: proofId,
        user_id: user,
        epoch: Number(epoch),
        commitment,
        factors: {
          estabilidad: bandToBandLevel(Number(stability)),
          inflows: bandToBandLevel(Number(inflows)),
          riesgo: bandToBandLevel(Number(risk)),
        },
        valid,
        created_at: new Date(Number(createdAt) * 1000).toISOString(),
        tx_hash: proofId,
      };

      const allA = stability === 0 && inflows === 0 && risk === 0;
      const status = allA ? 'apto' : 'casi';

      setResult({
        proof: { ...proof, status },
        onChainValid: valid,
      });
    } catch (err: any) {
      console.error(err);
      setError('Error al verificar la prueba. Verifica que el ID sea correcto.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <VerificationResult result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-[2rem] p-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal de Verificación</h1>
          <p className="text-slate-300">Para prestamistas y entidades financieras</p>
        </div>

        <div className="bg-dark-card rounded-[2.5rem] shadow-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-white mb-6">Verificar prueba sellada</h2>

          <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-300">
              Ingresa el ID de prueba (bytes32) compartido por el cliente para verificar su
              solvencia sin acceder a información personal.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              ID de prueba (0x...)
            </label>
            <input
              type="text"
              value={proofId}
              onChange={(e) => {
                setProofId(e.target.value);
                setError('');
              }}
              placeholder="0x..."
              className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-800 text-white rounded-2xl focus:border-blue-500 focus:outline-none transition-colors font-mono"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleVerify}
              disabled={loading || !proofId.trim()}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Verificando...' : 'Verificar ahora'}
            </button>

            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-2xl font-semibold transition-colors">
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="font-semibold text-white mb-3 text-sm">Qué verás al verificar:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Resultado (Apto/Casi) sin información personal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Bandas por factor de solvencia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Verificación en blockchain Scroll Sepolia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationResult({
  result,
  onReset,
}: {
  result: VerificationResult;
  onReset: () => void;
}) {
  const { proof } = result;

  const getBandColor = (band: string) => {
    switch (band) {
      case 'A':
        return 'bg-emerald-500 text-white';
      case 'B':
        return 'bg-amber-500 text-white';
      case 'C':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const factors = [
    { key: 'estabilidad', label: 'Estabilidad', value: proof.factors.estabilidad },
    { key: 'inflows', label: 'Ingresos', value: proof.factors.inflows },
    { key: 'riesgo', label: 'Riesgo', value: proof.factors.riesgo },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <div className="bg-dark-card rounded-[2.5rem] shadow-2xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div
              className={`rounded-full p-4 ${
                proof.status === 'apto' ? 'bg-primary' : 'bg-amber-500'
              }`}
            >
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {proof.status === 'apto' ? 'Verificado: APTO' : 'Verificado: CASI'}
            </h1>
            <p className="text-gray-400">
              {proof.status === 'apto'
                ? 'El cliente cumple los umbrales de solvencia'
                : 'El cliente está cerca pero no cumple todos los umbrales'}
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-[2rem] p-6 mb-8">
            <h3 className="font-semibold text-white mb-4">Bandas por factor</h3>
            <div className="grid gap-4">
              {factors.map((factor) => (
                <div
                  key={factor.key}
                  className="flex items-center justify-between bg-dark-card p-4 rounded-2xl"
                >
                  <span className="font-medium text-white">{factor.label}</span>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${getBandColor(factor.value)}`}>
                    Banda {factor.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {result.onChainValid && (
            <div className="border-2 rounded-2xl p-4 mb-8 bg-emerald-900/20 border-primary/30">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-white">
                    Verificado en Blockchain
                  </h3>
                  <p className="text-sm text-gray-400">
                    Prueba anclada y válida en Scroll Sepolia
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-white mb-3">Metadatos de verificación</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ID de Prueba:</span>
                <span className="font-mono text-white text-xs">
                  {proof.id.substring(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Generada:</span>
                <span className="text-white">
                  {new Date(proof.created_at).toLocaleString('es-ES')}
                </span>
              </div>
              {proof.commitment && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Commitment:</span>
                  <span className="font-mono text-white text-xs">
                    {proof.commitment.substring(0, 16)}...
                  </span>
                </div>
              )}
              {proof.epoch !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Época:</span>
                  <span className="text-white">{proof.epoch}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Explorador:</span>
                <a
                  href={`https://sepolia.scrollscan.com/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs hover:underline flex items-center gap-1"
                >
                  Ver contrato
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-semibold transition-colors">
              Solicitar underwriting
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-2xl font-semibold transition-colors"
            >
              Verificar otra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
