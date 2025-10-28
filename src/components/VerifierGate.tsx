import { useState } from 'react';
import { Shield, QrCode, Search, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { publicClient, CONTRACT_ADDRESS, CONTRACT_ABI, bandToBandLevel } from '../lib/contract';
import { Proof, Share } from '../types';

interface VerificationResult {
  proof: Proof;
  share: Share;
  onChainValid?: boolean;
}

export default function VerifierGate() {
  const [proofToken, setProofToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!proofToken.trim()) {
      setError('Por favor ingresa un ID o enlace de prueba');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = proofToken.includes('/verify/')
        ? proofToken.split('/verify/')[1]
        : proofToken.trim();

      const { data: shareData, error: shareError } = await supabase
        .from('shares')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (shareError) throw shareError;

      if (!shareData) {
        setError('Prueba no encontrada. Verifica el enlace o ID.');
        setLoading(false);
        return;
      }

      const now = new Date();
      const expiresAt = new Date(shareData.expires_at);

      if (now > expiresAt) {
        setError('Este enlace ha expirado. Solicita un nuevo enlace al cliente.');
        setLoading(false);
        return;
      }

      const { data: proofData, error: proofError } = await supabase
        .from('proofs')
        .select('*')
        .eq('id', shareData.proof_id)
        .maybeSingle();

      if (proofError) throw proofError;

      if (!proofData) {
        setError('Prueba no encontrada.');
        setLoading(false);
        return;
      }

      let onChainValid = false;

      if (proofData.blockchain_proof_id) {
        try {
          const contractProof = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getProofSummary',
            args: [proofData.blockchain_proof_id as `0x${string}`],
          });

          onChainValid = contractProof[6];
        } catch (err) {
          console.error('Error reading on-chain proof:', err);
        }
      }

      setResult({
        proof: proofData as Proof,
        share: shareData as Share,
        onChainValid,
      });
    } catch (err) {
      console.error(err);
      setError('Error al verificar la prueba. Intenta de nuevo.');
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
            <div className="bg-blue-600 rounded-2xl p-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal de Verificación</h1>
          <p className="text-slate-300">Para prestamistas y entidades financieras</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Verificar prueba sellada</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-700">
              Ingresa el enlace o ID de prueba compartido por el cliente para verificar su
              solvencia sin acceder a información personal.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Enlace o ID de prueba
            </label>
            <input
              type="text"
              value={proofToken}
              onChange={(e) => {
                setProofToken(e.target.value);
                setError('');
              }}
              placeholder="proof_abc123... o https://..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleVerify}
              disabled={loading || !proofToken.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Verificando...' : 'Verificar ahora'}
            </button>

            <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-4 rounded-xl font-semibold transition-colors">
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Qué verás al verificar:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Resultado (Apto/Casi) sin información personal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Bandas por factor de solvencia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Timestamp y metadatos de verificación</span>
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
  const { proof, share } = result;

  const getBandColor = (band: string) => {
    switch (band) {
      case 'A':
        return 'bg-emerald-500 text-white';
      case 'B':
        return 'bg-amber-500 text-white';
      case 'C':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-500 text-white';
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <div className="flex items-center justify-center mb-6">
            <div
              className={`rounded-full p-4 ${
                proof.status === 'apto' ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            >
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {proof.status === 'apto' ? 'Verificado: APTO' : 'Verificado: CASI'}
            </h1>
            <p className="text-slate-600">
              {proof.status === 'apto'
                ? 'El cliente cumple los umbrales de solvencia'
                : 'El cliente está cerca pero no cumple todos los umbrales'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Bandas por factor</h3>
            <div className="grid gap-4">
              {factors.map((factor) => (
                <div
                  key={factor.key}
                  className="flex items-center justify-between bg-white p-4 rounded-xl"
                >
                  <span className="font-medium text-slate-900">{factor.label}</span>
                  <span className={`px-4 py-2 rounded-lg font-semibold ${getBandColor(factor.value)}`}>
                    Banda {factor.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {result.onChainValid !== undefined && (
            <div className={`border-2 rounded-xl p-4 mb-8 ${
              result.onChainValid
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-amber-50 border-amber-300'
            }`}>
              <div className="flex items-center gap-3">
                <Shield className={`w-6 h-6 ${
                  result.onChainValid ? 'text-emerald-600' : 'text-amber-600'
                }`} />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {result.onChainValid ? 'Verificado en Blockchain' : 'Verificación Blockchain Pendiente'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {result.onChainValid
                      ? 'Prueba anclada y válida en Scroll'
                      : 'Esperando confirmación on-chain'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-3">Metadatos de verificación</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">ID de Prueba:</span>
                <span className="font-mono text-slate-900">
                  {proof.id.substring(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Generada:</span>
                <span className="text-slate-900">
                  {new Date(proof.created_at).toLocaleString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Válida hasta:</span>
                <span className="text-slate-900">
                  {new Date(proof.expires_at).toLocaleString('es-ES')}
                </span>
              </div>
              {proof.anchor_root && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Commitment:</span>
                  <span className="font-mono text-slate-900 text-xs">
                    {proof.anchor_root.substring(0, 16)}...
                  </span>
                </div>
              )}
              {proof.tx_hash && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">TX Hash:</span>
                  <a
                    href={`https://scrollscan.com/tx/${proof.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-600 text-xs hover:underline flex items-center gap-1"
                  >
                    {proof.tx_hash.substring(0, 12)}...
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {proof.epoch !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Época:</span>
                  <span className="text-slate-900">{proof.epoch}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors">
              Solicitar underwriting
            </button>
            <button
              onClick={onReset}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 py-4 rounded-xl font-semibold transition-colors"
            >
              Verificar otra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
