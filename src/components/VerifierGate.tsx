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
      const proofIdHex = proofId.startsWith('0x') ? (proofId as `0x${string}`) : (`0x${proofId}` as `0x${string}`);

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
      <div className="page-section">
        <div className="section-shell max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div
              className={`inline-flex rounded-full p-6 ${
                isApto ? 'border-green-400/40 bg-green-500/10' : 'border-amber-400/40 bg-amber-500/10'
              } border`}
            >
              <Shield className={`w-16 h-16 ${isApto ? 'text-green-300' : 'text-amber-200'}`} />
            </div>
            <h1 className="text-3xl font-semibold text-white">
              {isApto ? 'Verificación: Apto' : 'Verificación: Requiere revisión'}
            </h1>
            <p className="text-dark-muted">Resultado de la prueba sellada compartida por el solicitante.</p>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <h2 className="text-xl font-semibold text-white">Factores evaluados</h2>
            <div className="space-y-4">
              {[
                { label: 'Estabilidad', description: 'Consistencia de saldos', value: result.stability },
                { label: 'Inflows', description: 'Ingresos recurrentes', value: result.inflows },
                { label: 'Riesgo', description: 'Gestión de volatilidad', value: result.risk },
              ].map((factor) => (
                <div
                  key={factor.label}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <h3 className="text-white font-medium">{factor.label}</h3>
                    <p className="text-xs text-dark-muted">{factor.description}</p>
                  </div>
                  <span className="band-pill" data-tone={factor.value}>
                    Banda {factor.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-dark-muted">
              <strong className="text-white">Privacidad garantizada:</strong> Solo se muestran bandas y estado de la
              prueba. No se exponen montos ni contrapartes.
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <button className="btn-primary w-full">Solicitar underwriting</button>
              <button className="btn-secondary w-full">Descargar constancia</button>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-3 text-sm text-dark-muted">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-dark-subtle">Metadatos</h3>
            <div className="flex justify-between">
              <span>Usuario:</span>
              <span className="text-white font-mono text-xs">
                {result.user.substring(0, 6)}...{result.user.substring(result.user.length - 4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Época:</span>
              <span className="text-white">{result.epoch.toString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Creada:</span>
              <span className="text-white">{new Date(Number(result.createdAt) * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Estado:</span>
              <span className="text-green-200 font-semibold">Válida</span>
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setProofId('');
            }}
            className="btn-ghost mx-auto"
          >
            ← Verificar otra prueba
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="section-shell max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-6">
            <Shield className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Portal de Verificación</h1>
          <p className="text-dark-muted">Para prestamistas e instituciones financieras.</p>
        </div>

        <div className="glass-panel p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Verificar prueba</h2>
            <p className="text-dark-muted text-sm">
              Ingresa el ID compartido para ver el resultado y las bandas correspondientes sin exponer información
              sensible.
            </p>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-subtle">ID de prueba o enlace</label>
            <input
              type="text"
              value={proofId}
              onChange={(e) => setProofId(e.target.value)}
              placeholder="0x..."
              className="input-field font-mono"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
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

        <div className="glass-panel p-6 text-center text-sm text-dark-muted">
          <h3 className="text-white font-semibold mb-2">¿Qué verás?</h3>
          Resultado (Apto/Casi) y bandas por factor. No se exponen montos, contrapartes ni información personal del
          cliente.
        </div>
      </div>
    </div>
  );
}
