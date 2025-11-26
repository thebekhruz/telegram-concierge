import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Campus, ProgramType, Language } from '../../types';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', unique: true })
  telegramId!: number;

  @Column({ type: 'varchar', length: 2, nullable: true })
  language?: Language;

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

  @Column({ type: 'varchar', length: 50, nullable: true })
  currentStep?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
