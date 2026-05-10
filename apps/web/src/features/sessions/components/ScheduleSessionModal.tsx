'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { X, Calendar, Clock, Video, FileText, Loader2 } from 'lucide-react';
import { BarterRequest } from '@web/features/barter-requests/api/barter-requests-service';
import { sessionsService } from '../api/sessions-service';

interface ScheduleSessionModalProps {
  request: BarterRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export function ScheduleSessionModal({ request, onClose, onSuccess }: ScheduleSessionModalProps) {
  const { getToken } = useAuth();
  const [taughtUserSkillId, setTaughtUserSkillId] = useState(request.requestedUserSkillId);
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [meetLink, setMeetLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) return;

    try {
      setSubmitting(true);
      const token = await getToken();
      await sessionsService.create({
        barterRequestId: request.id,
        taughtUserSkillId,
        scheduledAt,
        durationMinutes,
        meetLink,
        notes,
      }, token);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule session');
    } finally {
      setSubmitting(false);
    }
  };

  const taughtSkillName = taughtUserSkillId === request.requestedUserSkillId 
    ? request.requestedUserSkill.skill.name 
    : request.offeredUserSkill.skill.name;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Schedule Session</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Finalize your barter by setting a time.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-4">
             <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Choose skill to teach first</label>
             <div className="flex gap-3">
               <button
                 type="button"
                 onClick={() => setTaughtUserSkillId(request.requestedUserSkillId)}
                 className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${taughtUserSkillId === request.requestedUserSkillId ? 'bg-white border-blue-600 text-blue-600 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                 {request.requestedUserSkill.skill.name}
               </button>
               <button
                 type="button"
                 onClick={() => setTaughtUserSkillId(request.offeredUserSkillId)}
                 className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 ${taughtUserSkillId === request.offeredUserSkillId ? 'bg-white border-blue-600 text-blue-600 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700'}`}
               >
                 {request.offeredUserSkill.skill.name}
               </button>
             </div>
             <p className="text-[10px] text-gray-500 italic text-center">
               The owner of "{taughtSkillName}" will be the mentor for this session.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Calendar size={14} className="text-blue-600" /> Date & Time
              </label>
              <input 
                type="datetime-local" 
                required
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Clock size={14} className="text-blue-600" /> Duration
              </label>
              <select 
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
              >
                <option value={30}>30 Minutes</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes</option>
                <option value={120}>120 Minutes</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Video size={14} className="text-blue-600" /> Meeting Link
            </label>
            <input 
              type="url" 
              placeholder="Google Meet, Zoom, etc."
              value={meetLink}
              onChange={e => setMeetLink(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
              <FileText size={14} className="text-blue-600" /> Notes
            </label>
            <textarea 
              placeholder="Any specific goals for this session?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px] resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:bg-blue-300 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : 'Confirm & Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
}
