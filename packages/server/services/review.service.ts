import type { Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../llm/prompts/summarize-reviews.txt';
export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return await reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string> {
    const reviews = await reviewRepository.getReviews(productId, 10);
    const JoinedReviews = reviews.map((r) => r.content).join('\n\n');
    const prompt = template.replace('{{reviews}}', JoinedReviews);

    const existingSummary = await reviewRepository.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }

    const response = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    });
    const summary = response.text;
    await reviewRepository.storeReviewSummary(productId, summary);
    return summary;
  },
};
