import { useState, useEffect } from 'react';
import { Shield, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWeb3 } from '../context/Web3Context';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  createWalletClientFromProvider,
  bandLevelToBand,
} from '../lib/contract';
import { Proof, BandLevel } from '../types';
import { keccak256, stringToHex } from 'viem';

const steps = [
  { id: 1, label: 'Recopilando señales', description: 'Analizando tu historial on-chain' },
  { id: 2, label: 'Sellando la prueba ZK', description: 'Generando verificación criptográfica' },
  { id: 3, label: 'Anclando en blockchain', description: 'Registrando en Scroll' },
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

export default function GenerateProof() {
  const { setCurrentScreen, setCurrentProof } = useApp();
  const { account } = useWeb3();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!account) return;

    const stepDuration = 8000;
    const updateInterval = 50;
    const progressPerUpdate = (100 / 4) / (stepDuration / updateInterval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressPerUpdate;

        if (newProgress >= 25 && currentStep === 1) {
          setCurrentStep(2);
        } else if (newProgress >= 50 && currentStep === 2) {
          setCurrentStep(3);
        } else if (newProgress >= 75 && currentStep === 3) {
          setCurrentStep(4);
        } else if (newProgress >= 100) {
          clearInterval(timer);
          generateProof();
        }

        return Math.min(newProgress, 100);
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [account, currentStep]);

  const generateProof = async () => {
    try {
      if (!account) throw new Error('Wallet no autenticada');

      const mockProof = generateMockProof();
      const currentEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));

      const proofId = keccak256(
        stringToHex(`${account}-${currentEpoch}-${Date.now()}`)
      );
      const commitment = keccak256(
        stringToHex(JSON.stringify(mockProof.factors) + Date.now())
      );

      const walletClient = createWalletClientFromProvider();
      if (!walletClient) throw new Error('No se pudo crear el cliente de wallet');

      const [address] = await walletClient.getAddresses();

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
        account: address,
      });

      const proof: Proof = {
        id: proofId,
        user_id: account,
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
      setTimeout(() => {
        setCurrentScreen(mockProof.status === 'apto' ? 'result-apto' : 'result-casi');
      }, 500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 'No pudimos generar tu prueba. Revisa tu conexión o intenta de nuevo.'
      );
    }
  };

  const handleCancel = () => {
    setCurrentScreen('landing');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="bg-dark-card rounded-[2.5rem] shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-white py-3 rounded-2xl font-semibold transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-2xl font-semibold transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="bg-dark-card rounded-[2.5rem] shadow-xl p-8 sm:p-12 max-w-2xl w-full">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-primary rounded-[2rem] p-4 relative">
            <Shield className="w-10 h-10 text-white" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="w-16 h-16 text-blue-300 animate-spin" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3 text-center">
          Generando tu prueba sellada
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Estimado: ~1 minuto
        </p>

        <div className="mb-10">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 transition-opacity ${
                  step.id === currentStep ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.id < currentStep
                      ? 'bg-primary text-white'
                      : step.id === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-slate-400'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-white mb-1">{step.label}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-card/50 border border-primary/20 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-300 text-center">
            Tu información no sale en claro. Solo generamos bandas y umbrales verificables on-chain.
          </p>
        </div>

        <button
          onClick={handleCancel}
          className="w-full bg-gray-200 hover:bg-gray-300 text-white py-3 rounded-2xl font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
