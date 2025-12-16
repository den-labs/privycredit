import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { Shield, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  bandLevelToBand,
  SCROLL_SEPOLIA_CHAIN_ID,
  SCROLL_SEPOLIA_NAME,
} from '../lib/contract';
import { Proof, BandLevel } from '../types';
import { keccak256, stringToHex } from 'viem';

const steps = [
  { id: 1, label: 'Recopilando señales', description: 'Analizando tu historial on-chain' },
  { id: 2, label: 'Sellando la prueba ZK', description: 'Generando verificación criptográfica' },
  { id: 3, label: 'Anclando en blockchain', description: 'Registrando en Scroll Sepolia' },
  { id: 4, label: 'Listo', description: 'Tu prueba está lista' },
];

const generateMockProof = (): { status: 'apto' | 'casi'; factors: any } => {
  const random = Math.random();

  if (random > 0.5) {
    return {
      status: 'apto',
      factors: {
        estabilidad: 'A' as BandLevel,
        inflows: 'A' as BandLevel,
        riesgo: 'A' as BandLevel,
      },
    };
  } else {
    return {
      status: 'casi',
      factors: {
        estabilidad: 'B' as BandLevel,
        inflows: 'B' as BandLevel,
        riesgo: 'C' as BandLevel,
      },
    };
  }
};

const getStepFromProgress = (progress: number) => {
  if (progress >= 75) return 4;
  if (progress >= 50) return 3;
  if (progress >= 25) return 2;
  return 1;
};

const getFriendlyErrorMessage = (err: any) => {
  const errorParts = [
    err,
    err?.cause,
  ];

  const hasRejectionSignal = errorParts.some((part) => {
    if (!part) return false;
    if (part.code === 4001) return true;
    if (typeof part.name === 'string' && part.name.toLowerCase().includes('rejected')) return true;

    return [part.shortMessage, part.message, part.details]
      .filter((msg): msg is string => typeof msg === 'string')
      .some((msg) => {
        const lower = msg.toLowerCase();
        return lower.includes('user rejected') || lower.includes('user denied');
      });
  });

  if (hasRejectionSignal) {
    return 'La firma fue cancelada manualmente. No se envió nada a la red, puedes volver a intentarlo cuando estés listo.';
  }

  return err?.message || 'Ocurrió un error inesperado al generar la prueba.';
};

export default function GenerateProof() {
  const { setCurrentScreen, setCurrentProof } = useApp();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const hasSubmittedRef = useRef(false);

  const generateProof = useCallback(async () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    try {
      if (!address) throw new Error('Wallet no autenticada');

      if (chainId !== SCROLL_SEPOLIA_CHAIN_ID) {
        throw new Error(`Red incorrecta. Esta aplicación solo funciona en ${SCROLL_SEPOLIA_NAME} (Chain ID: ${SCROLL_SEPOLIA_CHAIN_ID})`);
      }
      if (!walletClient) {
        throw new Error('No se detectó ninguna wallet conectada. Reintenta la conexión.');
      }
      const walletAccount = walletClient.account;
      if (!walletAccount) {
        throw new Error('No pudimos recuperar tu cuenta. Vuelve a conectar tu wallet.');
      }

      const mockProof = generateMockProof();
      const currentEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));

      const proofId = keccak256(
        stringToHex(`${address}-${currentEpoch}-${Date.now()}`)
      );
      const commitment = keccak256(
        stringToHex(JSON.stringify(mockProof.factors) + Date.now())
      );

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitProof',
        args: [
          proofId,
          BigInt(currentEpoch),
          commitment,
          bandLevelToBand(mockProof.factors.estabilidad),
          bandLevelToBand(mockProof.factors.inflows),
          bandLevelToBand(mockProof.factors.riesgo),
        ],
        account: walletAccount,
      });

      const proof: Proof = {
        id: proofId,
        user_id: address,
        status: mockProof.status,
        factors: mockProof.factors,
        anchor_root: commitment,
        blockchain_proof_id: proofId,
        tx_hash: hash,
        epoch: currentEpoch,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      setCurrentProof(proof);
      setCurrentScreen(mockProof.status === 'apto' ? 'result-apto' : 'result-casi');
    } catch (err: any) {
      console.error('Error generating proof:', err);
      setError(getFriendlyErrorMessage(err));
      hasSubmittedRef.current = false;
    }
  }, [address, chainId, walletClient, setCurrentProof, setCurrentScreen]);

  useEffect(() => {
    if (!address) return;

    setProgress(0);
    setCurrentStep(1);
    setError('');
    hasSubmittedRef.current = false;

    const stepDuration = 8000;
    const updateInterval = 50;
    const progressPerUpdate = (100 / 4) / (stepDuration / updateInterval);
    let progressValue = 0;

    const timer = setInterval(() => {
      progressValue = Math.min(progressValue + progressPerUpdate, 100);
      setProgress(progressValue);
      setCurrentStep((prev) => {
        const next = getStepFromProgress(progressValue);
        return prev === next ? prev : next;
      });

      if (progressValue >= 100) {
        clearInterval(timer);
        generateProof();
      }
    }, updateInterval);

    return () => clearInterval(timer);
  }, [address, generateProof]);

  if (error) {
    return (
      <div className="page-section">
        <div className="section-shell flex justify-center">
          <div className="glass-panel max-w-md w-full p-8 text-center space-y-6 border-red-500/50 bg-red-500/5">
            <div className="w-16 h-16 mx-auto rounded-full border border-red-400/40 bg-red-500/20 flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Error al generar prueba</h2>
              <p className="text-sm text-red-100">{error}</p>
            </div>
            <button onClick={() => setCurrentScreen('connect')} className="btn-primary w-full">
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="section-shell max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-6 animate-pulse">
            <Shield className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Generando tu prueba sellada</h1>
          <p className="text-dark-muted">Esto tomará unos segundos. No cerramos ninguna sesión ni compartimos tus datos.</p>
        </div>

        <div className="glass-panel p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3 text-sm text-dark-muted">
              <span>Progreso</span>
              <span className="text-white font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#66ffd4] via-[#4f7dff] to-[#8c4fff] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                  currentStep === step.id
                    ? 'border-white/40 bg-white/10'
                    : currentStep > step.id
                    ? 'border-green-400/40 bg-green-500/10'
                    : 'border-white/5 bg-white/5 text-dark-muted'
                }`}
              >
                <div className="flex-shrink-0">
                  {currentStep > step.id ? (
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">
                      ✓
                    </div>
                  ) : currentStep === step.id ? (
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Loader className="w-5 h-5 text-slate-950 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-sm">
                      {step.id}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{step.label}</h3>
                  <p className="text-sm text-dark-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel border-white/10 bg-white/5 p-4 text-center text-sm text-dark-muted">
          <strong className="text-white">Privacidad protegida:</strong> Solo compartiremos las bandas y el resultado final.
        </div>
      </div>
    </div>
  );
}
