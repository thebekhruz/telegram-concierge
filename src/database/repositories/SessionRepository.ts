import { AppDataSource } from '../index';
import { Session } from '../entities/Session';
import { UserSession } from '../../types';

export class SessionRepository {
  private repository = AppDataSource.getRepository(Session);

  async getSession(telegramId: number): Promise<Session | null> {
    return this.repository.findOne({ where: { telegramId } });
  }

  async updateSession(telegramId: number, data: Partial<UserSession>): Promise<Session> {
    let session = await this.getSession(telegramId);

    if (!session) {
      session = this.repository.create({ telegramId, ...data });
    } else {
      Object.assign(session, data);
    }

    return this.repository.save(session);
  }

  async clearSession(telegramId: number): Promise<void> {
    await this.repository.delete({ telegramId });
  }

  async setStep(telegramId: number, step: string): Promise<void> {
    await this.updateSession(telegramId, { step });
  }
}
