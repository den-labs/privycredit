import { Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import Landing from './components/Landing';
import NetworkAlert from './components/NetworkAlert';
import WalletControls from './components/WalletControls';
import Footer from './components/Footer';

const ConnectWallet = lazy(() => import('./components/ConnectWallet'));
const GenerateProof = lazy(() => import('./components/GenerateProof'));
const ResultApto = lazy(() => import('./components/ResultApto'));
const ResultCasi = lazy(() => import('./components/ResultCasi'));
const ShareProof = lazy(() => import('./components/ShareProof'));
const ImprovementChecklist = lazy(() => import('./components/ImprovementChecklist'));
const Simulator = lazy(() => import('./components/Simulator'));
const Reminders = lazy(() => import('./components/Reminders'));
const VerifierGate = lazy(() => import('./components/VerifierGate'));
const VerifyPublic = lazy(() => import('./components/VerifyPublic'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20 text-sm text-blue-100/70">
    Cargando...
  </div>
);

function App() {
  const { currentScreen } = useApp();
  const verifyPathId =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/verify/')
      ? decodeURIComponent(window.location.pathname.replace('/verify/', '').split('/')[0])
      : null;

  if (verifyPathId) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <VerifyPublic proofId={verifyPathId} />
      </Suspense>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'connect':
        return <ConnectWallet />;
      case 'generate':
        return <GenerateProof />;
      case 'result-apto':
        return <ResultApto />;
      case 'result-casi':
        return <ResultCasi />;
      case 'share':
        return <ShareProof />;
      case 'checklist':
        return <ImprovementChecklist />;
      case 'simulator':
        return <Simulator />;
      case 'reminders':
        return <Reminders />;
      case 'verifier':
        return <VerifierGate />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="app-shell antialiased min-h-screen">
      <NetworkAlert />
      <WalletControls />
      <main className="flex-1 pt-28 pb-16">
        <Suspense fallback={<LoadingFallback />}>{renderScreen()}</Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
