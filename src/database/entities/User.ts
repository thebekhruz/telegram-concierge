import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Language } from '../../types';
import { Conversation } from './Conversation';
import { Lead } from './Lead';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', unique: true })
  telegramId!: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 2, default: 'en' })
  language!: Language;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @Column({ type: 'boolean', default: true })
  canReceiveBroadcasts!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations!: Conversation[];

  @OneToMany(() => Lead, (lead) => lead.user)
  leads!: Lead[];
}
