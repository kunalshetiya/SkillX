'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { X, Star, Loader2, MessageSquare } from 'lucide-react';
import { reviewsService } from '../api/reviews-service';

interface ReviewModalProps {
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ sessionId, onClose, onSuccess }: ReviewModalProps) {
  const { getToken } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = await getToken();
      await reviewsService.create({
        sessionId,
        rating,
        comment,
      }, token);
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-900">Leave a Review</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">How was the session?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={40}
                    className={`${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-gray-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-amber-600">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </p>
          </div>

          <div className="space-y-3 text-left">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MessageSquare size={14} /> Additional Feedback
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How can the mentor improve?"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[120px] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:bg-blue-300 flex items-center justify-center gap-3"
          >
            {submitting ? <Loader2 className="animate-spin" size={24} /> : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
