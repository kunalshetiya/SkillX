'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { sessionsService, Session } from '@web/features/sessions/api/sessions-service';
import { SessionCard } from '@web/features/sessions/components/SessionCard';
import { Loader2, Calendar, History } from 'lucide-react';

export default function SessionsPage() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [activeTab]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = activeTab === 'upcoming' 
        ? await sessionsService.getUpcoming(token) 
        : await sessionsService.getHistory(token);
      setSessions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    try {
      const token = await getToken();
      await sessionsService.updateStatus(id, newStatus, token);
      loadSessions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center md:text-left">Mentorship Sessions</h1>
        <p className="text-gray-500 font-medium mt-1 text-center md:text-left text-sm md:text-base">Track your scheduled learning and teaching sessions.</p>
      </div>

      <div className="flex justify-center md:justify-start">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit border shadow-sm">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'upcoming' 
              ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar size={18} />
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'history' 
              ? 'bg-white text-blue-600 shadow-sm border border-gray-100' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History size={18} />
            History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white/50 rounded-3xl border border-dashed border-gray-200">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading sessions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-red-600 font-bold text-lg mb-2 text-center">Failed to load sessions</p>
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <button onClick={loadSessions} className="px-8 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
            Try Again
          </button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-32 text-center shadow-inner">
          <div className="max-w-xs mx-auto space-y-4 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300 border shadow-sm">
              {activeTab === 'upcoming' ? <Calendar size={40} /> : <History size={40} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900">No {activeTab} sessions</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {activeTab === 'upcoming' 
                ? "You don't have any sessions scheduled yet. Accept a barter request to get started!" 
                : "Your session history is empty. Once you complete sessions, they will appear here."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {sessions.map((session) => (
            <SessionCard 
              key={session.id} 
              session={session} 
              onUpdateStatus={(status) => handleStatusUpdate(session.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
