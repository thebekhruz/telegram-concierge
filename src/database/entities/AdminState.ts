import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('admin_states')
export class AdminState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', unique: true })
  adminId!: number;

  @Column({ type: 'boolean', default: false })
  interceptMode!: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  currentAction?: string;

  @Column({ type: 'jsonb', nullable: true })
  data?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
