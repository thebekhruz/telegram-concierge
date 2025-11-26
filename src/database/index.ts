import { DataSource } from 'typeorm';
import { config } from '../config';
import { User } from './entities/User';
import { Conversation } from './entities/Conversation';
import { Lead } from './entities/Lead';
import { Session } from './entities/Session';
import { AdminState } from './entities/AdminState';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.nodeEnv === 'development', // Auto-create tables in dev
  logging: config.nodeEnv === 'development',
  entities: [User, Conversation, Lead, Session, AdminState],
  migrations: [],
  subscribers: [],
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
}

export { User, Conversation, Lead, Session, AdminState };
