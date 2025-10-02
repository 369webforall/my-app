import axios from 'axios';
import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

type GetReviewResponse = {
  summary: string | null;
  reviews: Review[];
};

const ReviewList = ({ productId }: Props) => {
  const [reviewData, setReviewData] = useState<GetReviewResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<GetReviewResponse>(
        `/api/products/${productId}/reviews`
      );
      setReviewData(data);
    } catch (error) {
      console.error(error);
      setError('Could not fetch, the review, try again!!');
    } finally {
      setIsLoading(false);
    }
  };

  type SummarizeResponse = {
    summary: string;
  };

  const handleSummarize = async () => {
    const { data } = await axios.post<SummarizeResponse>(
      `/api/products/${productId}/reviews/summarize`
    );
    setSummary(data.summary);
  };

  useEffect(() => {
    fetchReviews();
  }, []);
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width={150} />
            <Skeleton width={100} />
            <Skeleton count={2} />
          </div>
        ))}
      </div>
    );
  }
  const currentSummary = reviewData?.summary || summary;

  if (!reviewData?.reviews.length) {
    return null;
  }
  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <Button onClick={handleSummarize}>
            <HiSparkles /> Summarize
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewData?.reviews.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
