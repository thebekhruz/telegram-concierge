import { AppDataSource } from '../index';
import { User } from '../entities/User';
import { Language } from '../../types';

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async findOrCreate(
    telegramId: number,
    username?: string,
    firstName?: string,
    lastName?: string
  ): Promise<User> {
    let user = await this.repository.findOne({ where: { telegramId } });

    if (!user) {
      user = this.repository.create({
        telegramId,
        username,
        firstName,
        lastName,
        language: 'en',
      });
      await this.repository.save(user);
    } else {
      // Update user info if changed
      let updated = false;
      if (username && user.username !== username) {
        user.username = username;
        updated = true;
      }
      if (firstName && user.firstName !== firstName) {
        user.firstName = firstName;
        updated = true;
      }
      if (lastName && user.lastName !== lastName) {
        user.lastName = lastName;
        updated = true;
      }
      if (updated) {
        await this.repository.save(user);
      }
    }

    return user;
  }

  async setLanguage(telegramId: number, language: Language): Promise<void> {
    await this.repository.update({ telegramId }, { language });
  }

  async setPhoneNumber(telegramId: number, phoneNumber: string): Promise<void> {
    await this.repository.update({ telegramId }, { phoneNumber });
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.find();
  }

  async getBroadcastableUsers(): Promise<User[]> {
    return this.repository.find({ where: { canReceiveBroadcasts: true } });
  }

  async getUser(telegramId: number): Promise<User | null> {
    return this.repository.findOne({ where: { telegramId } });
  }
}
