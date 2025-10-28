import { useState } from 'react';
import { ChevronLeft, Bell, Check, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function Reminders() {
  const { user, setCurrentScreen } = useApp();
  const [selectedDays, setSelectedDays] = useState(30);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetReminder = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + selectedDays);

      const { error: insertError } = await supabase.from('reminders').insert({
        user_id: user.id,
        reminder_date: reminderDate.toISOString(),
        status: 'pending',
      });

      if (insertError) throw insertError;

      setSuccess(true);

      setTimeout(() => {
        setCurrentScreen('result-casi');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el recordatorio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
          <div className="bg-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">¡Recordatorio configurado!</h2>
          <p className="text-slate-600">
            Te avisaremos en {selectedDays} días para que vuelvas a generar tu prueba con mejores
            señales.
          </p>
        </div>
      </div>
    );
  }

  const reminderDate = new Date();
  reminderDate.setDate(reminderDate.getDate() + selectedDays);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6">
        <button
          onClick={() => setCurrentScreen('result-casi')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 rounded-xl p-3">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Configurar recordatorio</h1>
          </div>

          <p className="text-slate-600 mb-8">
            Te avisaremos cuando sea buen momento para intentarlo de nuevo
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              ¿Cuándo quieres que te recordemos?
            </label>

            <div className="space-y-3">
              {[15, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    selectedDays === days
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-900">En {days} días</span>
                  </div>
                  {selectedDays === days && (
                    <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Fecha programada</h3>
                <p className="text-slate-700">
                  {reminderDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleSetReminder}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? 'Configurando...' : 'Confirmar recordatorio'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Puedes cancelar el recordatorio en cualquier momento
          </p>
        </div>
      </div>
    </div>
  );
}
