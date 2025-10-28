import { useState } from 'react';
import { Copy, Check, QrCode, ChevronLeft, ExternalLink, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ShareProof() {
  const { currentProof, setCurrentScreen } = useApp();
  const [copied, setCopied] = useState(false);

  if (!currentProof) {
    return null;
  }

  const shareUrl = `${window.location.origin}/verify/${currentProof.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <button
          onClick={() => setCurrentScreen('result-apto')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="bg-dark-card rounded-[2.5rem] shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-white mb-3">
            Compartir prueba sellada
          </h1>
          <p className="text-gray-400 mb-8">
            Comparte tu resultado con prestamistas
          </p>

          <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-white mb-3">Qué se comparte:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Tu resultado (Apto/Casi)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Bandas por factor (Estabilidad, Ingresos, Riesgo)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Verificación en blockchain</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Válido por 30 días</h3>
                <p className="text-sm text-gray-300">
                  El enlace expirará automáticamente después de 30 días por seguridad.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-300 font-mono break-all">{shareUrl}</p>
          </div>

          <div className="flex gap-3 mb-8">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar enlace
                </>
              )}
            </button>

            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5" />
              QR
            </button>
          </div>

          <div className="border-t border-gray-700 pt-6 mb-6">
            <h3 className="font-semibold text-white mb-4">Envío directo a aliados</h3>
            <div className="space-y-2">
              <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-3 rounded-2xl font-medium transition-colors flex items-center justify-between px-4">
                <span>Cooperativa A</span>
                <ExternalLink className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-3 rounded-2xl font-medium transition-colors flex items-center justify-between px-4">
                <span>Fintech B</span>
                <ExternalLink className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-4">
            <p className="text-sm text-gray-300 text-center">
              El enlace expira en 30 días. Solo se comparten bandas y resultado, nunca montos ni
              contrapartes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
