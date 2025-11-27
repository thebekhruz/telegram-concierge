import { AppDataSource } from '../index';
import { AdminState } from '../entities/AdminState';

export class AdminStateRepository {
  private repository = AppDataSource.getRepository(AdminState);

  async getAdminState(adminId: number): Promise<AdminState | null> {
    return this.repository.findOne({ where: { adminId } });
  }

  async setInterceptMode(adminId: number, enabled: boolean): Promise<void> {
    let state = await this.getAdminState(adminId);

    if (!state) {
      state = this.repository.create({ adminId, interceptMode: enabled });
    } else {
      state.interceptMode = enabled;
    }

    await this.repository.save(state);
  }

  async isInterceptMode(adminId: number): Promise<boolean> {
    const state = await this.getAdminState(adminId);
    return state?.interceptMode || false;
  }

  async setCurrentAction(adminId: number, action: string, data?: Record<string, unknown>): Promise<void> {
    let state = await this.getAdminState(adminId);

    if (!state) {
      state = this.repository.create({ adminId, currentAction: action, data });
    } else {
      state.currentAction = action;
      state.data = data;
    }

    await this.repository.save(state);
  }

  async clearAction(adminId: number): Promise<void> {
    await this.repository.update({ adminId }, { currentAction: undefined, data: undefined });
  }
}
