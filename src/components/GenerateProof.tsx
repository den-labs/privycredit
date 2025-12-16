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
      <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-300 rounded-3xl p-8 text-center shadow-lg">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-dark mb-3">Error al generar prueba</h2>
          <p className="text-red-700 text-sm mb-6">{error}</p>
          <button
            onClick={() => setCurrentScreen('connect')}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex bg-secondary/30 rounded-full p-6 mb-6 animate-pulse">
            <Shield className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-3">
            Generando tu prueba sellada
          </h1>
          <p className="text-dark-muted">
            Esto tomará aproximadamente 30 segundos
          </p>
        </div>

        <div className="bg-light-card/80 backdrop-blur-sm rounded-3xl border border-light-border shadow-lg p-8 mb-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-dark-muted">Progreso</span>
              <span className="text-sm font-bold text-dark">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-light rounded-full h-3 overflow-hidden border border-light-border">
              <div
                className="bg-gradient-to-r from-accent via-primary-dark to-accent h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                  currentStep === step.id
                    ? 'bg-secondary/30 border border-accent/50'
                    : currentStep > step.id
                    ? 'bg-green-50 border border-green-300'
                    : 'bg-light border border-light-border'
                }`}
              >
                <div className="flex-shrink-0">
                  {currentStep > step.id ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  ) : currentStep === step.id ? (
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Loader className="w-5 h-5 text-white animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-dark-subtle text-sm font-bold">{step.id}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    currentStep >= step.id ? 'text-dark' : 'text-dark-subtle'
                  }`}>
                    {step.label}
                  </h3>
                  <p className={`text-sm ${
                    currentStep >= step.id ? 'text-dark-muted' : 'text-dark-subtle'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/20 border border-accent/30 rounded-2xl p-4 text-center">
          <p className="text-dark text-sm">
            <strong>Tu información no sale en claro.</strong> Solo se comparten bandas de evaluación.
          </p>
        </div>
      </div>
    </div>
  );
}
