import { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  CalendarDays,
  Wallet,
} from 'lucide-react';
import {
  publicClient,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SCROLL_SEPOLIA_EXPLORER,
  bandToBandLevel,
} from '../lib/contract';
import { BandLevel } from '../types';

type VerifyPublicProps = {
  proofId: string;
};

type ProofView = {
  wallet: string;
  createdAt: Date;
  expiresAt: Date;
  factors: {
    estabilidad: BandLevel;
    inflows: BandLevel;
    riesgo: BandLevel;
  };
  txHash?: string;
};

const STATUS_META = {
  apto: {
    label: 'Apto',
    badge: 'chip chip-positive',
    description: 'Cumple los criterios para recibir una oferta preferente.',
  },
  casi: {
    label: 'Casi',
    badge: 'chip chip-alert',
    description: 'Necesita un repaso manual o un pequeño ajuste.',
  },
  'no-apto': {
    label: 'No apto',
    badge: 'chip chip-negative',
    description: 'La prueba está vencida, revocada o fuera de los parámetros.',
  },
};

const CONTACT_MESSAGE = (id: string) =>
  `Hola, revisé tu prueba en PrivyCredit (${id.slice(0, 10)}...). ¿Podemos agendar una llamada para continuar con tu solicitud?`;

export default function VerifyPublic({ proofId }: VerifyPublicProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proof, setProof] = useState<ProofView | null>(null);
  const [status, setStatus] = useState<keyof typeof STATUS_META>('no-apto');
  const [contactOpen, setContactOpen] = useState(false);

  const normalizedProofId = useMemo(() => {
    const trimmed = proofId.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('0x')) {
      return trimmed.toLowerCase() as `0x${string}`;
    }
    return (`0x${trimmed}` as `0x${string}`).toLowerCase() as `0x${string}`;
  }, [proofId]);

  useEffect(() => {
    let cancelled = false;

    const fetchProof = async () => {
      if (!normalizedProofId) {
        setError('No encontramos una prueba con ese identificador.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setProof(null);

      try {
        const data = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'getProofSummary',
          args: [normalizedProofId],
        });

        const [user, , , stability, inflows, risk, valid, createdAt] = data;

        if (!valid) {
          throw new Error('Esta prueba fue revocada, vencida o nunca existió.');
        }

        const createdAtMs = Number(createdAt) * 1000;
        const expiresAt = new Date(createdAtMs + 30 * 24 * 60 * 60 * 1000);

        const proofView: ProofView = {
          wallet: user as string,
          createdAt: new Date(createdAtMs),
          expiresAt,
          factors: {
            estabilidad: bandToBandLevel(Number(stability)),
            inflows: bandToBandLevel(Number(inflows)),
            riesgo: bandToBandLevel(Number(risk)),
          },
        };

        try {
          const latestBlock = await publicClient.getBlockNumber();
          const lookbackWindow = 2_000_000n;
          const fromBlock = latestBlock > lookbackWindow ? latestBlock - lookbackWindow : 0n;
          const logs = await publicClient.getContractEvents({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            eventName: 'ProofSubmitted',
            args: {
              proofId: normalizedProofId,
            },
            fromBlock,
          });

          if (logs.length > 0) {
            proofView.txHash = logs[logs.length - 1].transactionHash;
          }
        } catch (logsError) {
          console.warn('No pudimos obtener los logs de ProofSubmitted:', logsError);
        }

        if (!cancelled) {
          setProof(proofView);
        }
      } catch (err) {
        console.error('Error fetching public proof:', err);
        if (!cancelled) {
          setError('No pudimos verificar la prueba. Revisa el enlace o contacta al solicitante.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProof();

    return () => {
      cancelled = true;
    };
  }, [normalizedProofId]);

  useEffect(() => {
    if (!proof) return;
    const bands = [proof.factors.estabilidad, proof.factors.inflows, proof.factors.riesgo];
    if (bands.every((band) => band === 'A')) {
      setStatus('apto');
    } else if (bands.some((band) => band === 'C')) {
      setStatus('no-apto');
    } else {
      setStatus('casi');
    }
  }, [proof]);

  const handleOpenMail = () => {
    const body = encodeURIComponent(CONTACT_MESSAGE(proofId));
    window.open(`mailto:?subject=Solicitud%20de%20cr%C3%A9dito&body=${body}`, '_blank');
  };

  const handleOpenWhatsapp = () => {
    const text = encodeURIComponent(CONTACT_MESSAGE(proofId));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="page-section">
      <div className="section-shell w-full max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-6">
            <ShieldCheck className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Verificación de PrivyCredit</h1>
          <p className="text-dark-muted">Comprueba el estado compartido mediante un enlace seguro.</p>
        </div>

        {loading && (
          <div className="glass-panel p-10 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-lg text-white">Consultando la prueba en Scroll…</p>
          </div>
        )}

        {!loading && error && (
          <div className="glass-panel border-red-500/40 bg-red-500/10 p-8 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto" />
            <p className="text-sm text-red-100 leading-relaxed">{error}</p>
            <a href="/" className="btn-secondary inline-flex items-center justify-center gap-2 mx-auto">
              ← Volver a PrivyCredit
            </a>
          </div>
        )}

        {!loading && proof && (
          <div className="space-y-6">
            <div className="glass-panel p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-dark-muted mb-2">Estado</p>
                  <div className={`${STATUS_META[status].badge}`}>
                    <span>{STATUS_META[status].label}</span>
                  </div>
                  <p className="text-dark-muted text-sm mt-2">{STATUS_META[status].description}</p>
                </div>
                <div className="text-sm text-dark-muted">
                  <p className="mb-2 font-semibold text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Wallet evaluada
                  </p>
                  <p className="font-mono text-white">
                    {proof.wallet.substring(0, 6)}...{proof.wallet.substring(proof.wallet.length - 4)}
                  </p>
                  <p className="text-xs text-dark-subtle mt-1">Anclada con hash único.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-dark-muted">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-dark-subtle uppercase">Emitida</p>
                      <p className="text-white font-semibold">{proof.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-dark-subtle uppercase">Expira</p>
                      <p className="text-white font-semibold">{proof.expiresAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-dark-subtle uppercase">ID Prueba</p>
                      <p className="text-white font-mono text-xs">
                        {normalizedProofId?.substring(0, 10)}...
                        {normalizedProofId?.substring(normalizedProofId.length - 6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {(['estabilidad', 'inflows', 'riesgo'] as const).map((key) => (
                  <div key={key} className="flex-1 min-w-[200px] rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-dark-muted capitalize mb-1">{key}</p>
                    <p className="text-xs text-dark-subtle mb-3">
                      {key === 'estabilidad' && 'Consistencia de saldos'}
                      {key === 'inflows' && 'Ingresos recurrentes'}
                      {key === 'riesgo' && 'Gestión de riesgo'}
                    </p>
                    <span className="band-pill" data-tone={proof.factors[key]}>
                      Banda {proof.factors[key]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {proof.txHash ? (
                  <a
                    href={`${SCROLL_SEPOLIA_EXPLORER}/tx/${proof.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verificado en Scroll
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="chip chip-positive text-xs">Verificado en Scroll</div>
                )}
                <div className="text-xs text-dark-muted flex-1">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    Solo se comparten bandas y estado. Montos y contrapartes permanecen privados.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Contactar solicitante</h2>
                  <p className="text-sm text-dark-muted">
                    Continúa la solicitud directamente por el canal que prefieras.
                  </p>
                </div>
                <button onClick={() => setContactOpen((prev) => !prev)} className="btn-primary w-full md:w-auto">
                  {contactOpen ? 'Ocultar opciones' : 'Contactar solicitante'}
                </button>
              </div>

              {contactOpen && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <button onClick={handleOpenMail} className="btn-secondary w-full justify-center">
                    <Mail className="w-5 h-5 text-accent" />
                    Email
                  </button>
                  <button onClick={handleOpenWhatsapp} className="btn-secondary w-full justify-center">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    WhatsApp
                  </button>
                </div>
              )}
            </div>

            <div className="glass-panel p-6 text-sm text-dark-muted">
              <p className="font-semibold text-white mb-2">Qué NO estamos compartiendo</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Balances, montos o ingresos exactos del solicitante.</li>
                <li>Contrapartes, historial de pagos o interacciones DeFi.</li>
                <li>Cualquier dato personal identificable fuera de la wallet evaluada.</li>
              </ul>
            </div>

            <div className="text-center pt-2">
              <a href="/" className="btn-ghost inline-block">
                ← Volver a PrivyCredit
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
