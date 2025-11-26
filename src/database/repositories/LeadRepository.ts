import { AppDataSource } from '../index';
import { Lead } from '../entities/Lead';
import { Campus, ProgramType } from '../../types';

export interface CreateLeadData {
  userId: number;
  phoneNumber?: string;
  campus?: Campus;
  programType?: ProgramType;
  classLevel?: string;
  numberOfChildren?: number;
  year?: string;
  calculationResult?: Record<string, unknown>;
}

export class LeadRepository {
  private repository = AppDataSource.getRepository(Lead);

  async createLead(data: CreateLeadData): Promise<Lead> {
    const lead = this.repository.create({
      ...data,
      status: 'new',
    });

    return this.repository.save(lead);
  }

  async updateLeadStatus(leadId: number, status: 'new' | 'contacted' | 'converted' | 'lost'): Promise<void> {
    await this.repository.update({ id: leadId }, { status });
  }

  async getLeadsByUser(userId: number): Promise<Lead[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTotalLeads(): Promise<number> {
    return this.repository.count();
  }

  async getLeadsByStatus(status: 'new' | 'contacted' | 'converted' | 'lost'): Promise<Lead[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }
}
