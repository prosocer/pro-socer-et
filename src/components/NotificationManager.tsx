import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Wifi, WifiOff, X, CheckCircle2 } from 'lucide-react';

interface ToastAlert {
  id: string;
  title: string;
  body: string;
  time: string;
}

export const NotificationManager: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeToasts, setActiveToasts] = useState<ToastAlert[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerPushSample = () => {
    const sampleAlerts = [
      {
        id: `alert-${Date.now()}`,
        title: '⚽ Match Update: Arsenal vs Chelsea',
        body: 'Arsenal scored in 64th min! 1X Double Chance status: SECURE. Over 2.5 on track.',
        time: 'Just now',
      },
      {
        id: `alert-${Date.now() + 1}`,
        title: '🔥 Real-Time Odds Drift Alert',
        body: '1X official odds on Real Madrid Over 2.5 shifted from 1.62 to 1.55 (Heavy volume surge).',
        time: 'Just now',
      },
      {
        id: `alert-${Date.now() + 2}`,
        title: '✅ Outcome Won: 1,000 Birr slip paid',
        body: 'Final result verified. Double chance prediction recorded as WON.',
        time: 'Just now',
      },
    ];

    const pick = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    setActiveToasts((prev) => [pick, ...prev.slice(0, 2)]);

    // Auto dismiss
    setTimeout(() => {
      setActiveToasts((prev) => prev.filter((t) => t.id !== pick.id));
    }, 6000);
  };

  const toggleNotifications = () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    if (nextState) {
      triggerPushSample();
    }
  };

  return (
    <>
      {/* Status Bar Pills */}
      <div className="flex items-center gap-2">
        {/* Offline / Online indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            isOnline
              ? 'bg-slate-900 border-slate-700 text-slate-300'
              : 'bg-amber-950/80 border-amber-500 text-amber-300'
          }`}
          title={isOnline ? 'Online real-time feed connected' : 'Offline caching active'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Live Feed</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>Offline Mode</span>
            </>
          )}
        </div>

        {/* Push Notification Toggle */}
        <button
          onClick={toggleNotifications}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
            notificationsEnabled
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle match update push alerts"
        >
          {notificationsEnabled ? (
            <>
              <BellRing className="w-3 h-3 text-emerald-400 animate-bounce" />
              <span>Alerts ON</span>
            </>
          ) : (
            <>
              <Bell className="w-3 h-3" />
              <span>Alerts OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Push Toast Stack */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl text-slate-100 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-300"
          >
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white leading-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.body}</div>
              <div className="text-[9px] text-slate-500 font-mono mt-1">{toast.time}</div>
            </div>
            <button
              onClick={() => setActiveToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-500 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
