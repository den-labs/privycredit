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
      <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex bg-green-100 rounded-full p-6 mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-4">¡Recordatorio activado!</h1>
          <p className="text-dark mb-2">
            Te avisaremos el {reminderDate.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <p className="text-dark-muted text-sm mb-8">
            Será buen momento para generar una nueva prueba con tus mejoras
          </p>
          <button
            onClick={() => setCurrentScreen('landing')}
            className="bg-accent hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-light-card to-light py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex bg-secondary/30 rounded-full p-6 mb-4">
            <Bell className="w-16 h-16 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-3">Programar recordatorio</h1>
          <p className="text-dark">
            Te avisaremos cuando sea buen momento para intentarlo de nuevo
          </p>
        </div>

        <div className="bg-light-card/80 backdrop-blur-sm rounded-3xl border border-light-border shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-dark mb-6">¿Cuándo quieres que te recordemos?</h2>

          <div className="space-y-3 mb-8">
            {[15, 30, 60, 90].map((days) => (
              <label
                key={days}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  selectedDays === days
                    ? 'bg-secondary/30 border-2 border-accent'
                    : 'bg-light border-2 border-light-border hover:bg-secondary/20'
                }`}
              >
                <input
                  type="radio"
                  name="days"
                  value={days}
                  checked={selectedDays === days}
                  onChange={() => setSelectedDays(days)}
                  className="w-5 h-5 text-accent"
                />
                <div className="flex-1">
                  <p className="font-medium text-dark">{days} días</p>
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

          <div className="bg-secondary/20 border border-accent/30 rounded-xl p-4 mb-6">
            <p className="text-dark text-sm">
              Te enviaremos un recordatorio cuando sea un buen momento para generar
              una nueva prueba con tus mejoras aplicadas.
            </p>
          </div>

          <button
            onClick={handleSetReminder}
            className="w-full bg-accent hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            Activar recordatorio
          </button>
        </div>

        <button
          onClick={() => setCurrentScreen('result-casi')}
          className="text-dark-muted hover:text-dark text-sm transition-colors mx-auto block"
        >
          ← Volver a resultados
        </button>
      </div>
    </div>
  );
}
