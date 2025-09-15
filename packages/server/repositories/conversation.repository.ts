const conversations = new Map<string, string>();
// convestaionId -> lastResponseId
// conv1-> 100
//conv2 -> 200

export const conversationRepository = {
  getLastResponseId(conversationId: string) {
    return conversations.get(conversationId);
  },

  setLastResponseId(conversationId: string, responseId: string) {
    conversations.set(conversationId, responseId);
  },
};
