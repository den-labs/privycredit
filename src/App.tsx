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

function App() {
  const { currentScreen, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    );
  }

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

  return <div className="antialiased">{renderScreen()}</div>;
}

export default App;
