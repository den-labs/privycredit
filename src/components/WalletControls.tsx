import { useState } from 'react';
import { AppKitNetworkButton, useAppKit } from '@reown/appkit/react';
import { Shield, Wallet, Menu, X } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useApp } from '../context/AppContext';
import { Button } from './ui';

export default function WalletControls() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { setCurrentScreen } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpen = () => {
    open?.();
  };

  const navItems = [
    { label: 'Cómo funciona', action: () => setCurrentScreen('landing') },
    { label: 'Simulador', action: () => setCurrentScreen('simulator') },
    { label: 'Verificadores', action: () => setCurrentScreen('verifier') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0f172a]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setCurrentScreen('landing');
            setMobileOpen(false);
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Privy<span className="text-blue-400">Credit</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setMobileOpen(false);
              }}
              className="text-sm font-medium text-blue-100/70 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="h-4 w-px bg-white/10 mx-2" />
          {isConnected && (
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-blue-300/70">
              <span>Red</span>
              <div className="border border-white/10 rounded-full px-2 py-1 bg-white/5 text-[10px]">
                <AppKitNetworkButton />
              </div>
            </div>
          )}
          <Button
            variant="secondary"
            onClick={handleOpen}
            className="!py-2.5 !px-5 !text-xs !rounded-lg border-blue-400/20 hover:border-blue-400/40"
          >
            <Wallet className="w-4 h-4 text-blue-300" />
            {isConnected ? 'Gestionar Wallet' : 'Conectar Wallet'}
          </Button>
        </div>

        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#020617]/95 backdrop-blur-lg px-6 py-6 space-y-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setMobileOpen(false);
                }}
                className="text-base text-left text-blue-100/80 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          {isConnected && (
            <div className="flex items-center gap-3 text-xs text-blue-200/70">
              <span>Red:</span>
              <div className="border border-white/10 rounded-full px-3 py-1 bg-white/5">
                <AppKitNetworkButton />
              </div>
            </div>
          )}
          <Button onClick={handleOpen} className="w-full justify-center">
            <Wallet className="w-4 h-4" />
            {isConnected ? 'Gestionar Wallet' : 'Conectar Wallet'}
          </Button>
        </div>
      )}
    </nav>
  );
}
