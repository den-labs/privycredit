import { useState } from 'react';
import { Bell, CheckCircle, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Reminders() {
  const { setCurrentScreen } = useApp();
  const [selectedDays, setSelectedDays] = useState(30);
  const [reminderSet, setReminderSet] = useState(false);

  const reminderDate = new Date(Date.now() + selectedDays * 24 * 60 * 60 * 1000);

  const handleSetReminder = () => {
    setReminderSet(true);
  };

  if (reminderSet) {
    return (
      <div className="page-section">
        <div className="section-shell flex justify-center">
          <div className="glass-panel max-w-md w-full p-8 text-center space-y-4">
            <div className="inline-flex rounded-full border border-green-400/40 bg-green-500/10 p-6">
              <CheckCircle className="w-16 h-16 text-green-300" />
            </div>
            <h1 className="text-3xl font-semibold text-white">¡Recordatorio activado!</h1>
            <p className="text-dark-muted">
              Te avisaremos el{' '}
              {reminderDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-sm text-dark-muted">
              Será un buen momento para generar una nueva prueba con tus mejoras aplicadas.
            </p>
            <button onClick={() => setCurrentScreen('landing')} className="btn-primary w-full">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="section-shell max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-6">
            <Bell className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-semibold text-white">Programar recordatorio</h1>
          <p className="text-dark-muted">Te avisaremos cuando sea buen momento para intentarlo de nuevo.</p>
        </div>

        <div className="glass-panel p-8 space-y-8">
          <h2 className="text-xl font-semibold text-white">¿Cuándo quieres que te recordemos?</h2>
          <div className="space-y-3">
            {[15, 30, 60, 90].map((days) => (
              <label
                key={days}
                className={`flex items-center gap-4 rounded-3xl border p-4 cursor-pointer transition ${
                  selectedDays === days ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/25'
                }`}
              >
                <input
                  type="radio"
                  name="days"
                  value={days}
                  checked={selectedDays === days}
                  onChange={() => setSelectedDays(days)}
                  className="w-5 h-5 text-accent focus:ring-accent/50"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{days} días</p>
                  <p className="text-xs text-dark-muted">
                    {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-dark-muted" />
              </label>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-dark-muted">
            Te enviaremos un recordatorio cuando sea un buen momento para generar una nueva prueba con tus mejoras.
          </div>

          <button onClick={handleSetReminder} className="btn-primary w-full">
            Activar recordatorio
          </button>
        </div>

        <button onClick={() => setCurrentScreen('result-casi')} className="btn-ghost mx-auto">
          ← Volver a resultados
        </button>
      </div>
    </div>
  );
}
