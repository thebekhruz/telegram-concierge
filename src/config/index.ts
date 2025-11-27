import dotenv from 'dotenv';

dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  crmChannelId: process.env.CRM_CHANNEL_ID || '',
  webAppUrl: process.env.WEB_APP_URL || 'http://localhost:3000',
  webAppPort: parseInt(process.env.WEB_APP_PORT || '3000'),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'telegram_concierge',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  adminUserIds: process.env.ADMIN_USER_IDS
    ? process.env.ADMIN_USER_IDS.split(',').map((id) => parseInt(id.trim()))
    : [],
  nodeEnv: process.env.NODE_ENV || 'development',
};

export function validateConfig() {
  if (!config.botToken) {
    throw new Error('BOT_TOKEN is required in .env file');
  }
  if (!config.crmChannelId) {
    console.warn('Warning: CRM_CHANNEL_ID is not set. Manager connection feature will not work.');
  }
  if (config.adminUserIds.length === 0) {
    console.warn('Warning: No ADMIN_USER_IDS set. Admin panel will not be accessible.');
  }
}
