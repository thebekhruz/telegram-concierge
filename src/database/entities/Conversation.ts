import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint' })
  userId!: number;

  @Column({ type: 'text' })
  messageText!: string;

  @Column({ type: 'text', nullable: true })
  botResponse?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  messageType?: string; // 'user' | 'bot' | 'admin'

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.conversations)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
