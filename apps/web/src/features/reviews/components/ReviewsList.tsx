'use client';

import { Review } from '../api/reviews-service';
import { ReviewCard } from './ReviewCard';
import { MessageSquare } from 'lucide-react';

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
}

export function ReviewsList({ reviews, loading }: ReviewsListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 py-20 px-8 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <MessageSquare size={28} />
        </div>
        <div className="max-w-xs mx-auto">
          <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
          <p className="text-gray-500 text-sm mt-2">
            After you complete sessions, your students can leave feedback here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
