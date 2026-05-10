import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Session, SessionStatus } from '../api/sessions-service';
import { Calendar, Clock, ExternalLink, Check, X, User, BookOpen, Star } from 'lucide-react';
import { ReviewModal } from '@web/features/reviews/components/ReviewModal';

interface SessionCardProps {
  session: Session;
  onUpdateStatus: (status: 'COMPLETED' | 'CANCELLED' | 'ONGOING') => void;
}

export function SessionCard({ session, onUpdateStatus }: SessionCardProps) {
  const { user } = useUser();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Use Clerk user ID for role detection
  const isMentor = session.mentor.id === user?.id;
  const otherUser = isMentor ? session.learner : session.mentor;

  const statusConfig: Record<SessionStatus, { label: string; color: string; icon: any }> = {
    SCHEDULED: { label: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Calendar },
    ONGOING: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    COMPLETED: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200', icon: Check },
    CANCELLED: { label: 'Cancelled', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: X },
    NO_SHOW: { label: 'No Show', color: 'bg-red-50 text-red-700 border-red-200', icon: X },
  };

  const status = statusConfig[session.status];
  const date = new Date(session.scheduledAt);

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-bold uppercase overflow-hidden">
             {otherUser.imageUrl ? (
               <img src={otherUser.imageUrl} alt={otherUser.username} className="w-full h-full object-cover" />
             ) : (
               otherUser.name?.[0] || otherUser.username[0].toUpperCase()
             )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${isMentor ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                {isMentor ? 'Teaching' : 'Learning'}
              </span>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {otherUser.name || otherUser.username}
              </p>
            </div>
            <p className="text-xs text-gray-500 leading-tight mt-1">@{otherUser.username}</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.color}`}>
          <status.icon size={12} />
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-y border-gray-50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skill</p>
          <div className="flex items-center gap-2 text-gray-900">
            <BookOpen size={16} className="text-blue-600" />
            <span className="font-bold">{session.taughtUserSkill.skill.name}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</p>
          <div className="flex items-center gap-2 text-gray-900">
            <Calendar size={16} className="text-blue-600" />
            <span className="font-bold">{date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
          <div className="flex items-center gap-2 text-gray-900">
            <Clock size={16} className="text-blue-600" />
            <span className="font-bold">{session.durationMinutes} Minutes</span>
          </div>
        </div>
      </div>

      {session.meetLink && session.status === 'SCHEDULED' && (
        <a 
          href={session.meetLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <ExternalLink size={18} /> Join Meeting
        </a>
      )}

      {session.status === 'SCHEDULED' && (
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => onUpdateStatus('COMPLETED')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-green-600 border border-green-100 rounded-xl font-bold hover:bg-green-50 transition-all"
          >
            <Check size={18} /> Mark Complete
          </button>
          <button 
            onClick={() => onUpdateStatus('CANCELLED')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all"
          >
            <X size={18} /> Cancel
          </button>
        </div>
      )}

      {session.status === 'COMPLETED' && (
        <div className="pt-2">
           <button 
             onClick={() => setIsReviewModalOpen(true)}
             className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
           >
             <Star size={18} className="fill-white" /> Leave a Review
           </button>
        </div>
      )}

      {isReviewModalOpen && (
        <ReviewModal 
          sessionId={session.id}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            alert('Review submitted successfully!');
          }}
        />
      )}

      {session.notes && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notes</p>
          <p className="text-sm text-gray-600">{session.notes}</p>
        </div>
      )}
    </div>
  );
}
