import { PrismaClient, type Review } from '../generated/prisma';
const prisma = new PrismaClient();
import dayjs from 'dayjs';
export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getReviewSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: {
        AND: [{ productId }, { expireAt: { gt: new Date() } }],
      },
    });

    return summary ? summary.content : null;
  },
  async storeReviewSummary(productId: number, summary: string) {
    const now = new Date();
    const expireAt = dayjs().add(7, 'days').toDate();
    const data = {
      content: summary,
      expireAt,
      generatedAt: now,
      productId,
    };

    return await prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },
};
