import { Review } from '../api/reviews-service';
import { Star, Quote } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.createdAt);

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 font-bold uppercase overflow-hidden">
             {review.reviewer.imageUrl ? (
               <img src={review.reviewer.imageUrl} alt={review.reviewer.username} className="w-full h-full object-cover" />
             ) : (
               review.reviewer.name?.[0] || review.reviewer.username[0].toUpperCase()
             )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {review.reviewer.name || review.reviewer.username}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">@{review.reviewer.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-amber-700">{review.rating}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
           Learned {review.session.taughtUserSkill.skill.name}
        </p>
        
        {review.comment && (
          <div className="relative">
            <Quote size={16} className="text-gray-100 absolute -top-2 -left-2 -z-10" />
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{review.comment}"
            </p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 font-medium text-right italic">
        {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}
