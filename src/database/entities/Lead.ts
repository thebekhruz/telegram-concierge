import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Campus, ProgramType } from '../../types';
import { User } from './User';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  campus?: Campus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  programType?: ProgramType;

  @Column({ nullable: true })
  classLevel?: string;

  @Column({ type: 'int', nullable: true })
  numberOfChildren?: number;

  @Column({ nullable: true })
  year?: string;

  @Column({ type: 'jsonb', nullable: true })
  calculationResult?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'new' })
  status!: 'new' | 'contacted' | 'converted' | 'lost';

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.leads)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
