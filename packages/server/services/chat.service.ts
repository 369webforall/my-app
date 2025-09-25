import { conversationRepository } from '../repositories/conversation.repository';
import { llmClient } from '../llm/client';

type chatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<chatResponse> {
    const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0.2,
      maxTokens: 100,
      previousResponseId:
        conversationRepository.getLastResponseId(conversationId),
    });
    conversationRepository.setLastResponseId(conversationId, response.id);
    return {
      id: response.id,
      message: response.text,
    };
  },
};
