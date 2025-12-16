import { useState } from 'react';
import { Shield, Search, AlertCircle } from 'lucide-react';
import { publicClient, CONTRACT_ADDRESS, CONTRACT_ABI, bandToBandLevel } from '../lib/contract';
import { BandLevel } from '../types';

type VerificationResult = {
  user: string;
  epoch: bigint;
  commitment: string;
  stability: BandLevel;
  inflows: BandLevel;
  risk: BandLevel;
  valid: boolean;
  createdAt: bigint;
} | null;

const getBandColor = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'B':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'C':
      return 'bg-red-100 text-red-700 border-red-300';
  }
};

export default function VerifierGate() {
  const [proofId, setProofId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerificationResult>(null);

  const handleVerify = async () => {
    if (!proofId || proofId.length < 10) {
      setError('Ingresa un ID de prueba válido');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const proofIdHex = proofId.startsWith('0x') ? proofId as `0x${string}` : `0x${proofId}` as `0x${string}`;

      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProofSummary',
        args: [proofIdHex],
      });

      const [user, epoch, commitment, stability, inflows, risk, valid, createdAt] = data;

      if (!valid) {
        setError('Esta prueba ha sido revocada o no existe');
        return;
      }

      setResult({
        user: user as string,
        epoch,
        commitment: commitment as string,
        stability: bandToBandLevel(Number(stability)),
        inflows: bandToBandLevel(Number(inflows)),
        risk: bandToBandLevel(Number(risk)),
        valid,
        createdAt,
      });
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('No se pudo verificar la prueba. Verifica el ID e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const isApto = result.stability === 'A' && result.inflows === 'A' && result.risk === 'A';

    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex rounded-full p-6 mb-4 ${
              isApto ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Shield className={`w-16 h-16 ${isApto ? 'text-green-500' : 'text-yellow-500'}`} />
            </div>
            <h1 className="text-3xl font-bold text-dark mb-3">
              {isApto ? 'Verificación: Apto' : 'Verificación: Requiere revisión'}
            </h1>
            <p className="text-dark">Resultado de la prueba sellada</p>
          </div>

          <div className="bg-light-card/80 backdrop-blur-sm rounded-3xl border border-light-border shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-dark mb-6">Factores evaluados</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-light-border">
                <div>
                  <h3 className="font-medium text-dark mb-1">Estabilidad</h3>
                  <p className="text-xs text-dark-muted">Consistencia de saldos</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBandColor(result.stability)}`}>
                  Banda {result.stability}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-light-border">
                <div>
                  <h3 className="font-medium text-dark mb-1">Inflows</h3>
                  <p className="text-xs text-dark-muted">Ingresos recurrentes</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBandColor(result.inflows)}`}>
                  Banda {result.inflows}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-light rounded-xl border border-light-border">
                <div>
                  <h3 className="font-medium text-dark mb-1">Riesgo</h3>
                  <p className="text-xs text-dark-muted">Gestión de volatilidad</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getBandColor(result.risk)}`}>
                  Banda {result.risk}
                </span>
              </div>
            </div>

            <div className="bg-secondary/20 border border-accent/30 rounded-xl p-4 mb-6">
              <p className="text-dark text-sm">
                <strong>Sin PII:</strong> Esta verificación no expone montos, contrapartes
                ni información personal del usuario. Solo muestra bandas de evaluación.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button className="bg-accent hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-all shadow-md">
                Solicitar underwriting
              </button>
              <button className="bg-light-card hover:bg-light border border-light-border text-dark py-3 rounded-xl font-semibold transition-all">
                Descargar constancia
              </button>
            </div>
          </div>

          <div className="bg-light-card/80 backdrop-blur-sm rounded-2xl border border-light-border shadow-md p-6 mb-6">
            <h3 className="text-sm font-semibold text-dark mb-3">Metadatos de la prueba</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-muted">Usuario:</span>
                <span className="text-dark font-mono text-xs">
                  {result.user.substring(0, 6)}...{result.user.substring(result.user.length - 4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">Época:</span>
                <span className="text-dark">{result.epoch.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">Creada:</span>
                <span className="text-dark">
                  {new Date(Number(result.createdAt) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">Estado:</span>
                <span className="text-green-600 font-semibold">Válida</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setProofId('');
            }}
            className="text-dark-muted hover:text-dark text-sm transition-colors mx-auto block"
          >
            ← Verificar otra prueba
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex bg-secondary/30 rounded-full p-6 mb-4">
            <Shield className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-3">Portal de Verificación</h1>
          <p className="text-dark">
            Para prestamistas e instituciones financieras
          </p>
        </div>

        <div className="bg-light-card/80 backdrop-blur-sm rounded-3xl border border-light-border shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-dark mb-4">Verificar prueba</h2>
          <p className="text-dark-muted text-sm mb-6">
            Ingresa el ID de prueba que te compartió el cliente para ver su resultado
            y bandas de evaluación sin exponer información personal.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-dark mb-2">
              ID de prueba o enlace
            </label>
            <input
              type="text"
              value={proofId}
              onChange={(e) => setProofId(e.target.value)}
              placeholder="0x..."
              className="w-full bg-light border border-light-border rounded-xl px-4 py-3 text-dark placeholder-dark-subtle focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-primary-dark disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-all disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Verificar ahora
              </>
            )}
          </button>
        </div>

        <div className="bg-secondary/20 border border-accent/30 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-dark mb-2">¿Qué verás?</h3>
          <p className="text-dark text-sm">
            Resultado (Apto/Casi) y bandas por factor. No se exponen montos,
            contrapartes ni información personal del cliente.
          </p>
        </div>
      </div>
    </div>
  );
}
