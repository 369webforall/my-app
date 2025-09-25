import type { Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    const reviews = await reviewRepository.getReviews(productId, 10);
    const JoinedReviews = reviews.map((r) => r.content).join('\n\n');
    const prompt = `
    Summarize the following customer reviews into a short paragraph highlighting key themes or point, both positive and negative ${JoinedReviews}
    `;

    const response = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    });
    return response.text;
  },
};
