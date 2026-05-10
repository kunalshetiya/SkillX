'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { X, Send, ArrowRightLeft, Loader2, Award } from 'lucide-react';
import { MarketplaceSkill } from '@web/features/marketplace/api/marketplace-service';
import { profileService, UserProfile } from '@web/features/profile/api/profile-service';
import { barterRequestsService } from '../api/barter-requests-service';

interface BarterRequestModalProps {
  skill: MarketplaceSkill;
  onClose: () => void;
  onSuccess: () => void;
}

export function BarterRequestModal({ skill, onClose, onSuccess }: BarterRequestModalProps) {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = await getToken();
        if (!token) {
          setError('You must be signed in to propose a barter.');
          setLoading(false);
          return;
        }
        const data = await profileService.getMe(token);
        setProfile(data);
        const offerings = data.skills.filter(s => s.type === 'OFFERING');
        if (offerings.length > 0) {
          setSelectedSkillId(offerings[0].id);
        }
      } catch (err: any) {
        console.error('BarterRequestModal: Profile load failed', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      setSubmitting(true);
      const token = await getToken();
      await barterRequestsService.create({
        receiverId: skill.user.id,
        offeredUserSkillId: selectedSkillId,
        requestedUserSkillId: skill.id, 
        message,
      }, token);
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const offerings = profile?.skills.filter(s => s.type === 'OFFERING') || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-900">Propose a Barter</h2>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center py-12 space-y-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading your skills...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100">
              {error}
            </div>
          ) : offerings.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                <Award size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No skills to offer</h3>
              <p className="text-gray-500 text-sm">
                You need to add at least one "Offering" skill to your profile before you can propose a barter.
              </p>
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold"
              >
                Go to Profile
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">You want to learn</p>
                  <h4 className="font-bold text-gray-900">{skill.skill.name}</h4>
                  <p className="text-xs text-gray-500">from @{skill.user.username}</p>
                </div>
                <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm border">
                  <ArrowRightLeft size={18} />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">You will teach</p>
                  <select 
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none text-center md:text-right"
                  >
                    {offerings.map(s => (
                      <option key={s.id} value={s.id}>{s.skill.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Personal Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell them why you'd like to exchange skills..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:bg-blue-300 flex items-center justify-center gap-3"
              >
                {submitting ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> Send Proposal</>}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
