import { useState } from 'react';
import { Share2, Copy, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCROLL_SEPOLIA_EXPLORER } from '../lib/contract';

export default function ShareProof() {
  const { currentProof, setCurrentScreen } = useApp();
  const [copied, setCopied] = useState(false);

  if (!currentProof) {
    setCurrentScreen('landing');
    return null;
  }

  const shareBase =
    typeof window !== 'undefined' && import.meta.env.DEV
      ? window.location.origin
      : import.meta.env.VITE_PUBLIC_SHARE_BASE ?? 'https://privycredit.vercel.app';
  const normalizedBase = shareBase.endsWith('/') ? shareBase.slice(0, -1) : shareBase;
  const shareLink = `${normalizedBase}/verify/${currentProof.blockchain_proof_id}`;
  const shareBase =
    typeof window !== 'undefined' && import.meta.env.DEV
      ? window.location.origin
      : import.meta.env.VITE_PUBLIC_SHARE_BASE ?? 'https://privycredit.vercel.app';
  const normalizedBase = shareBase.endsWith('/') ? shareBase.slice(0, -1) : shareBase;
  const shareLink = `${normalizedBase}/verify/${currentProof.blockchain_proof_id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysUntilExpiry = Math.ceil(
    (new Date(currentProof.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="page-section">
      <div className="section-shell max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-6">
            <Share2 className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Compartir prueba</h1>
          <p className="text-dark-muted">Genera un enlace seguro para que prestamistas verifiquen tu resultado.</p>
        </div>

        <div className="glass-panel p-8 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Enlace de verificación</h2>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-dark-muted">
                <Clock className="w-5 h-5 text-amber-300" />
                Este enlace expira en <strong className="text-white font-semibold">{daysUntilExpiry} días</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <a
                  href={shareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent font-mono break-all hover:text-white"
                >
                  {shareLink}
                </a>
              </div>
              <button onClick={handleCopy} className="btn-primary w-full">
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar enlace
                  </>
                )}
              </button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-dark-muted">
              <strong className="text-white">Qué se comparte:</strong> Estado (Apto/Casi) y bandas por factor. Ningún
              monto, contraparte ni dato personal sale en claro.
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white">Compartir con aliados</h3>
            <div className="grid gap-3">
              {['Cooperativa A', 'Fintech B', 'Banco C'].map((ally) => (
                <button
                  key={ally}
                  className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-white hover:border-white/30 transition"
                >
                  <div>
                    <p className="font-medium">{ally}</p>
                    <p className="text-xs text-dark-muted">Integración directa</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-dark-muted" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-2 text-sm text-dark-muted">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-dark-subtle">Detalles</h3>
          <div className="flex justify-between">
            <span>Estado:</span>
            <span className="text-white font-semibold capitalize">{currentProof.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Creada:</span>
            <span className="text-white">{new Date(currentProof.created_at).toLocaleDateString()}</span>
          </div>
          {currentProof.tx_hash && (
            <div className="flex justify-between items-center">
              <span>Blockchain:</span>
              <a
                href={`${SCROLL_SEPOLIA_EXPLORER}/tx/${currentProof.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:text-white text-xs"
              >
                Ver transacción
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <button
          onClick={() => setCurrentScreen(currentProof.status === 'apto' ? 'result-apto' : 'result-casi')}
          className="btn-ghost mx-auto"
        >
          ← Volver a resultados
        </button>
      </div>
    </div>
  );
}
