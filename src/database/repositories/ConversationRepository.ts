import { AppDataSource } from '../index';
import { Conversation } from '../entities/Conversation';

export class ConversationRepository {
  private repository = AppDataSource.getRepository(Conversation);

  async logMessage(
    userId: number,
    messageText: string,
    botResponse?: string,
    messageType?: string,
    metadata?: Record<string, unknown>
  ): Promise<Conversation> {
    const conversation = this.repository.create({
      userId,
      messageText,
      botResponse,
      messageType,
      metadata,
    });

    return this.repository.save(conversation);
  }

  async getConversationHistory(userId: number, limit = 50): Promise<Conversation[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getTotalConversations(): Promise<number> {
    return this.repository.count();
  }
}
