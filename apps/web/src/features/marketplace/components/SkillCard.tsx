import { MarketplaceSkill } from '../api/marketplace-service';
import { Award, User, MessageCircle } from 'lucide-react';

interface SkillCardProps {
  skill: MarketplaceSkill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const levelColors: any = {
    BEGINNER: 'bg-slate-100 text-slate-700',
    INTERMEDIATE: 'bg-green-100 text-green-700',
    ADVANCED: 'bg-blue-100 text-blue-700',
    EXPERT: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="bg-white rounded-2xl border hover:shadow-md transition-all p-6 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${levelColors[skill.level] || 'bg-gray-100'}`}>
          {skill.level}
        </div>
        {skill.user.isMentor && (
          <div className="flex items-center gap-1 text-blue-600">
            <Award size={14} />
            <span className="text-[10px] font-bold uppercase">Mentor</span>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
        {skill.skill.name}
      </h3>
      
      <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 italic">
        {skill.description || "No description provided."}
      </p>

      <div className="pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
            {skill.user.name?.[0] || skill.user.username[0].toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">
              {skill.user.name || skill.user.username}
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">@{skill.user.username}</p>
          </div>
        </div>

        <button className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all">
          <MessageCircle size={18} />
        </button>
      </div>
    </div>
  );
}
