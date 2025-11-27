import { initializeDatabase } from './database';
import { createBot } from './bot';
import { config, validateConfig } from './config';
import { startWebServer } from './server';

async function main() {
  try {
    console.log('🚀 Starting Telegram Concierge Bot...');

    // Validate configuration
    validateConfig();

    // Initialize database
    await initializeDatabase();

    // Start web server for mini app
    await startWebServer(config.webAppPort);

    // Create and launch bot
    const bot = createBot();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    // Start bot
    await bot.launch();

    console.log('✅ Bot is running!');
    console.log(`📋 Environment: ${config.nodeEnv}`);
    console.log(`👥 Admin users: ${config.adminUserIds.join(', ') || 'None'}`);
    console.log(`📱 Mini app: ${config.webAppUrl}`);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

main();
