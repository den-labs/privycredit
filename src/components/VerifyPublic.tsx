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

const getBandColor = (band: BandLevel) => {
  switch (band) {
    case 'A':
      return 'bg-accent/20 text-green-400 border-green-500/50';
    case 'B':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'C':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
  }
};

const STATUS_META = {
  apto: {
    label: 'Apto',
    badge: 'bg-green-500/20 text-green-300 border border-green-500/50',
    description: 'Cumple los criterios para recibir una oferta preferente.',
  },
  casi: {
    label: 'Casi',
    badge: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50',
    description: 'Necesita un repaso manual o un pequeño ajuste.',
  },
  'no-apto': {
    label: 'No apto',
    badge: 'bg-red-500/20 text-red-200 border border-red-500/50',
    description: 'La prueba está vencida, revocada o fuera de los parámetros.',
  },
};

const CONTACT_MESSAGE = (proofId: string) =>
  `Hola, revisé tu prueba en PrivyCredit (${proofId.slice(0, 10)}...). ¿Podemos agendar una llamada para continuar con tu solicitud?`;

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
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-card to-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex bg-accent/20 rounded-full p-6 mb-4">
            <ShieldCheck className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-light mb-3">Verificación de PrivyCredit</h1>
          <p className="text-gray-300">
            Comprueba el estado compartido mediante un enlace seguro sin crear cuenta.
          </p>
        </div>

        {loading && (
          <div className="bg-dark-card/50 backdrop-blur-sm rounded-3xl border border-dark-border p-10 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <p className="text-light text-lg">Consultando la prueba en Scroll...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-900/50 border border-red-500 rounded-3xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <p className="text-red-100 mb-4 text-sm leading-relaxed">{error}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-light font-semibold hover:underline"
            >
              Volver a PrivyCredit
            </a>
          </div>
        )}

        {!loading && proof && (
          <div className="space-y-6">
            <div className="bg-dark-card/50 backdrop-blur-sm rounded-3xl border border-dark-border p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
                    Estado de la solicitud
                  </p>
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${STATUS_META[status].badge}`}>
                    <span className="font-semibold text-base">{STATUS_META[status].label}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{STATUS_META[status].description}</p>
                </div>

                <div className="text-sm text-gray-400">
                  <p className="mb-2 font-semibold text-light flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Wallet evaluada
                  </p>
                  <p className="font-mono text-light">
                    {proof.wallet.substring(0, 6)}...{proof.wallet.substring(proof.wallet.length - 4)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Anclada con hash único.</p>
                </div>
              </div>

              <div className="bg-dark-card/30 border border-dark-border rounded-2xl p-6 mb-6">
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Emitida</p>
                      <p className="text-light font-semibold">
                        {proof.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Expira</p>
                      <p className="text-light font-semibold">
                        {proof.expiresAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Prueba</p>
                      <p className="text-light font-mono text-xs">
                        {normalizedProofId?.substring(0, 10)}...
                        {normalizedProofId?.substring(normalizedProofId.length - 6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {(['estabilidad', 'inflows', 'riesgo'] as const).map((key) => (
                  <div key={key} className="flex-1 min-w-[200px] bg-dark-card/30 rounded-2xl border border-dark-border p-5">
                    <p className="text-sm text-gray-400 capitalize mb-1">{key}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      {key === 'estabilidad' && 'Consistencia de saldos'}
                      {key === 'inflows' && 'Ingresos recurrentes'}
                      {key === 'riesgo' && 'Gestión de riesgo'}
                    </p>
                    <span className={`inline-flex px-4 py-1 rounded-full text-sm font-bold border ${getBandColor(proof.factors[key])}`}>
                      Banda {proof.factors[key]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                {proof.txHash ? (
                  <a
                    href={`${SCROLL_SEPOLIA_EXPLORER}/tx/${proof.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500/10 text-green-200 border border-green-500/40 hover:bg-green-500/20 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verificado en Scroll
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-700/40 text-gray-200 border border-gray-600/40">
                    <ShieldCheck className="w-4 h-4" />
                    Verificado en Scroll
                  </div>
                )}

                <div className="text-xs text-gray-400 flex-1 text-left">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-300" />
                    Solo se comparten bandas y estado. Montos y contrapartes permanecen privados.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card/50 backdrop-blur-sm rounded-3xl border border-dark-border p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-light mb-2">Contactar solicitante</h2>
                  <p className="text-sm text-gray-300">
                    Continúa la solicitud directamente por el canal que prefieras.
                  </p>
                </div>
                <button
                  onClick={() => setContactOpen((prev) => !prev)}
                  className="px-6 py-3 rounded-2xl bg-accent text-dark font-semibold hover:bg-primary-dark transition-all"
                >
                  {contactOpen ? 'Ocultar opciones' : 'Contactar solicitante'}
                </button>
              </div>

              {contactOpen && (
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={handleOpenMail}
                    className="flex items-center justify-center gap-3 bg-dark-card/30 border border-dark-border rounded-2xl px-4 py-4 text-light hover:bg-dark-card/50 transition-all text-sm font-semibold"
                  >
                    <Mail className="w-5 h-5 text-accent" />
                    Email
                  </button>
                  <button
                    onClick={handleOpenWhatsapp}
                    className="flex items-center justify-center gap-3 bg-dark-card/30 border border-dark-border rounded-2xl px-4 py-4 text-light hover:bg-dark-card/50 transition-all text-sm font-semibold"
                  >
                    <MessageCircle className="w-5 h-5 text-green-300" />
                    WhatsApp
                  </button>
                </div>
              )}
            </div>

            <div className="bg-dark-card/30 border border-dark-border rounded-3xl p-6 text-sm text-gray-300">
              <p className="font-semibold text-light mb-2">Qué NO estamos compartiendo</p>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Balances, montos o ingresos exactos del solicitante.</li>
                <li>Contrapartes, historial de pagos o interacciones DeFi.</li>
                <li>Cualquier dato personal identificable fuera de la wallet evaluada.</li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <a href="/" className="text-gray-400 hover:text-light text-sm">
                ← Volver a PrivyCredit
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
