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

function App() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    if (window.location.pathname.startsWith('/verify')) {
      return <VerifierGate />;
    }

    switch (currentScreen) {
      case 'landing':
        return <Landing />;
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
      case 'improvements':
        return <ImprovementChecklist />;
      case 'simulator':
        return <Simulator />;
      case 'reminders':
        return <Reminders />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="antialiased">
      <NetworkAlert />
      {renderScreen()}
    </div>
  );
}

export default App;
