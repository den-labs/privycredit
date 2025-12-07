import { useApp } from './context/AppContext';
import Landing from './components/Landing';
import ConnectWallet from './components/ConnectWallet';
import GenerateProof from './components/GenerateProof';
import ResultApto from './components/ResultApto';
import ResultCasi from './components/ResultCasi';
import ShareProof from './components/ShareProof';
import ImprovementChecklist from './components/ImprovementChecklist';
import Simulator from './components/Simulator';
import Reminders from './components/Reminders';
import VerifierGate from './components/VerifierGate';
import NetworkAlert from './components/NetworkAlert';
import WalletControls from './components/WalletControls';
import Footer from './components/Footer';
import VerifyPublic from './components/VerifyPublic';

function App() {
  const { currentScreen } = useApp();
  const verifyPathId =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/verify/')
      ? decodeURIComponent(window.location.pathname.replace('/verify/', '').split('/')[0])
      : null;

  if (verifyPathId) {
    return <VerifyPublic proofId={verifyPathId} />;
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
    <div className="antialiased flex flex-col min-h-screen">
      <NetworkAlert />
      <WalletControls />
      <div className="flex-1">
        {renderScreen()}
      </div>
      <Footer />
    </div>
  );
}

export default App;
