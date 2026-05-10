import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarterRequest, BarterRequestStatus } from '../api/barter-requests-service';
import { ArrowRightLeft, User, MessageCircle, Check, X, Clock, Calendar } from 'lucide-react';
import { ScheduleSessionModal } from '@web/features/sessions/components/ScheduleSessionModal';

interface RequestCardProps {
  request: BarterRequest;
  type: 'incoming' | 'outgoing';
  onUpdateStatus: (status: BarterRequestStatus) => void;
}

export function RequestCard({ request, type, onUpdateStatus }: RequestCardProps) {
  const router = useRouter();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const otherUser = type === 'incoming' ? request.sender : request.receiver;

  const statusConfig: Record<BarterRequestStatus, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    ACCEPTED: { label: 'Accepted', color: 'bg-green-50 text-green-700 border-green-200', icon: Check },
    REJECTED: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200', icon: X },
    COMPLETED: { label: 'Completed', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Check },
    CANCELLED: { label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: X },
  };

  const status = statusConfig[request.status];

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold uppercase">
            {otherUser?.name?.[0] || otherUser?.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {type === 'incoming' ? 'From' : 'To'} {otherUser?.name || otherUser?.username}
            </p>
            <p className="text-xs text-gray-500 leading-tight">@{otherUser?.username}</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
          <status.icon size={12} />
          {status.label}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 md:gap-12 relative overflow-hidden">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 border-t-2 border-dashed border-gray-200" />
        
        <div className="flex-1 text-center md:text-left z-10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Offered Skill</p>
          <h4 className="text-lg font-bold text-gray-900">{request.offeredUserSkill.skill.name}</h4>
          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg">{request.offeredUserSkill.level}</span>
        </div>

        <div className="p-3 bg-white rounded-full shadow-sm border z-10 text-blue-600 rotate-90 md:rotate-0">
          <ArrowRightLeft size={20} />
        </div>

        <div className="flex-1 text-center md:text-right z-10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Requested Skill</p>
          <h4 className="text-lg font-bold text-gray-900">{request.requestedUserSkill.skill.name}</h4>
          <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg">{request.requestedUserSkill.level}</span>
        </div>
      </div>

      {request.message && (
        <div className="flex gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
          <MessageCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 italic leading-relaxed">"{request.message}"</p>
        </div>
      )}

      {request.status === 'PENDING' && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {type === 'incoming' ? (
            <>
              <button 
                onClick={() => onUpdateStatus('ACCEPTED')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Check size={18} /> Accept Request
              </button>
              <button 
                onClick={() => onUpdateStatus('REJECTED')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
              >
                <X size={18} /> Reject
              </button>
            </>
          ) : (
            <button 
              onClick={() => onUpdateStatus('CANCELLED')}
              className="flex-1 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel Proposal
            </button>
          )}
        </div>
      )}

      {request.status === 'ACCEPTED' && (
        <div className="pt-2">
           <button 
             onClick={() => setIsScheduleModalOpen(true)}
             className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
           >
             <Calendar size={18} /> Schedule Session
           </button>
        </div>
      )}

      {isScheduleModalOpen && (
        <ScheduleSessionModal 
          request={request}
          onClose={() => setIsScheduleModalOpen(false)}
          onSuccess={() => {
            setIsScheduleModalOpen(false);
            router.push('/sessions');
          }}
        />
      )}
    </div>
  );
}
