'use client';

import { useState, useEffect } from 'react';
import { User, Github, Linkedin, ExternalLink, Plus, Save, X, Award, BookOpen } from 'lucide-react';
import { profileService, UserProfile } from '../api/profile-service';

export function ProfileDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getMe();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
      <p className="text-red-600 font-medium">Failed to load profile</p>
      <p className="text-red-500 text-sm mt-1">{error}</p>
      <button 
        onClick={loadProfile}
        className="mt-4 text-sm font-semibold text-red-700 hover:text-red-800 underline"
      >
        Try again
      </button>
    </div>
  );
  
  if (!profile) return null;

  const handleRemoveSkill = async (id: string) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    try {
      await profileService.removeSkill(id);
      loadProfile();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-semibold transition-all border shadow-sm"
          >
            {isEditing ? <><X size={16} /> Cancel</> : <><User size={16} /> Edit Profile</>}
          </button>
        </div>

        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg transform -rotate-3">
            {profile.name?.[0] || profile.username[0].toUpperCase()}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">{profile.name || 'Anonymous User'}</h1>
          <p className="text-gray-500 font-medium">@{profile.username}</p>
          
          <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
             <div className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
               <Award size={14} />
               {profile.credits} Credits
             </div>
             
             <div className="flex gap-2">
               {profile.githubUrl && (
                 <a href={profile.githubUrl} target="_blank" className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border transition-colors">
                   <Github size={18} />
                 </a>
               )}
               {profile.linkedinUrl && (
                 <a href={profile.linkedinUrl} target="_blank" className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-100 transition-colors">
                   <Linkedin size={18} />
                 </a>
               )}
               {profile.portfolioUrl && (
                 <a href={profile.portfolioUrl} target="_blank" className="p-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-100 transition-colors">
                   <ExternalLink size={18} />
                 </a>
               )}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bio & Skills */}
        <div className="lg:col-span-8 space-y-8">
          {isEditing ? (
            <ProfileEditForm profile={profile} onUpdate={loadProfile} onCancel={() => setIsEditing(false)} />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                About Me
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "No bio added yet. Tell the community about your expertise and what you're looking to learn!"}
              </p>
            </div>
          )}

          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Award size={20} className="text-blue-600" />
              Skill Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest">
                  <Award size={16} />
                  Offering
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.filter(s => s.type === 'OFFERING').map(skill => (
                    <SkillBadge key={skill.id} skill={skill} onRemove={() => handleRemoveSkill(skill.id)} />
                  ))}
                  {profile.skills.filter(s => s.type === 'OFFERING').length === 0 && (
                    <p className="text-gray-400 italic text-sm py-4">You haven't listed any skills to teach yet.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-purple-600 uppercase tracking-widest">
                  <BookOpen size={16} />
                  Learning
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.filter(s => s.type === 'LEARNING').map(skill => (
                    <SkillBadge key={skill.id} skill={skill} onRemove={() => handleRemoveSkill(skill.id)} />
                  ))}
                  {profile.skills.filter(s => s.type === 'LEARNING').length === 0 && (
                    <p className="text-gray-400 italic text-sm py-4">You haven't listed any learning goals yet.</p>
                  )}
                </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-4 space-y-8">
          <AddSkillForm onSkillAdded={loadProfile} />
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
             <h3 className="text-lg font-bold mb-2">Grow Your Credits</h3>
             <p className="text-blue-100 text-sm mb-4 leading-relaxed">
               Help others by teaching your skills to earn more credits. Each session earns you 50 credits!
             </p>
             <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors border border-white/20">
               Browse Requests
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillBadge({ skill, onRemove }: { skill: any, onRemove: () => void }) {
  const levelColors: any = {
    BEGINNER: 'bg-slate-50 text-slate-700 border-slate-200',
    INTERMEDIATE: 'bg-green-50 text-green-700 border-green-200',
    ADVANCED: 'bg-blue-50 text-blue-700 border-blue-200',
    EXPERT: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <div className={`group relative px-4 py-2.5 rounded-xl border-2 transition-all hover:scale-105 ${levelColors[skill.level] || 'bg-gray-50 border-gray-100'}`}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
      >
        <X size={12} />
      </button>
      <div className="flex flex-col">
        <span className="font-bold text-[15px] leading-tight">{skill.skill.name}</span>
        <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider mt-0.5">{skill.level}</span>
      </div>
    </div>
  );
}

function ProfileEditForm({ profile, onUpdate, onCancel }: { profile: UserProfile, onUpdate: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await profileService.updateMe(formData);
      onUpdate();
      onCancel();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
        <div className="flex gap-2">
           <button 
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
          <input 
            type="text" 
            placeholder="How others should see you"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bio</label>
          <textarea 
            placeholder="Tell us about your experience..."
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">GitHub URL</label>
            <div className="relative">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="url" 
                value={formData.githubUrl}
                onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
            <div className="relative">
              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="url" 
                value={formData.linkedinUrl}
                onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:bg-blue-300 transition-all active:scale-[0.98]"
      >
        {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> Save Profile</>}
      </button>
    </form>
  );
}

function AddSkillForm({ onSkillAdded }: { onSkillAdded: () => void }) {
  const [skillName, setSkillName] = useState('');
  const [type, setType] = useState<'OFFERING' | 'LEARNING'>('OFFERING');
  const [level, setLevel] = useState('BEGINNER');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;
    try {
      setSubmitting(true);
      await profileService.addSkill({ skillName, type, level });
      setSkillName('');
      onSkillAdded();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Plus size={20} className="text-blue-600" />
        Add Skill
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Skill Name</label>
          <input 
            type="text" 
            placeholder="e.g. React, Node.js"
            value={skillName}
            onChange={e => setSkillName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('OFFERING')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border-2 ${type === 'OFFERING' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
          >
            OFFERING
          </button>
          <button
            type="button"
            onClick={() => setType('LEARNING')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border-2 ${type === 'LEARNING' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
          >
            LEARNING
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Expertise Level</label>
          <select 
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-400"
      >
        {submitting ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Plus size={20} /> Add to Profile</>}
      </button>
    </form>
  );
}
