'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { barterRequestsService, BarterRequest } from '@web/features/barter-requests/api/barter-requests-service';
import { RequestCard } from '@web/features/barter-requests/components/RequestCard';
import { Loader2, Inbox, Send } from 'lucide-react';

export default function RequestsPage() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [requests, setRequests] = useState<BarterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const data = activeTab === 'incoming' 
        ? await barterRequestsService.getIncoming(token) 
        : await barterRequestsService.getOutgoing(token);
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    try {
      const token = await getToken();
      await barterRequestsService.updateStatus(id, newStatus, token);
      loadRequests();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Barter Requests</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your skill exchange proposals.</p>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'incoming' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Inbox size={18} />
          Received
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'outgoing' 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Send size={18} />
          Sent
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium italic">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-bold">Failed to load requests</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button onClick={loadRequests} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">
            Try Again
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-32 text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              {activeTab === 'incoming' ? <Inbox size={32} /> : <Send size={32} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900">No {activeTab} requests</h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'incoming' 
                ? "You haven't received any barter proposals yet." 
                : "You haven't sent any barter proposals yet. Go to the marketplace to find skills!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <RequestCard 
              key={request.id} 
              request={request} 
              type={activeTab}
              onUpdateStatus={(status) => handleStatusUpdate(request.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
