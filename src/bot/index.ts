import { Telegraf, Context } from 'telegraf';
import { config } from '../config';
import { SessionRepository } from '../database/repositories/SessionRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { ConversationRepository } from '../database/repositories/ConversationRepository';

// Handlers
import { handleStart } from './handlers/startHandler';
import { handleLanguageSelection, handleChangeLanguage } from './handlers/languageHandler';
import {
  handleCalculatorStart,
  handleCampusSelection,
  handleProgramSelection,
  handleClassSelection,
  handleRussianClassButtonSelection,
  handleRussianClassInput,
  handleChildrenSelection,
  handleYearSelection,
  handlePaymentPeriodSelection,
} from './handlers/calculatorHandler';
import { handleConnectManager, handlePhoneNumber } from './handlers/managerHandler';
import { handleFaq, handleFaqTopic } from './handlers/faqHandler';
import { handleContactInfo } from './handlers/contactHandler';
import {
  handleAdminCommand,
  handleAdminStats,
  handleAdminIntercept,
  handleAdminBroadcast,
  handleBroadcastInput,
  handleBroadcastConfirm,
  handleBroadcastCancel,
  interceptUserMessage,
  isAdmin,
} from './handlers/adminHandler';
import { getMainMenuKeyboard } from './keyboards';
import { Language, Campus, ProgramType, PaymentPeriod } from '../types';

const sessionRepo = new SessionRepository();
const userRepo = new UserRepository();
const conversationRepo = new ConversationRepository();

export function createBot(): Telegraf {
  const bot = new Telegraf(config.botToken);

  // Start command
  bot.command('start', handleStart);

  // Admin command
  bot.command('admin', handleAdminCommand);

  // Language selection callbacks
  bot.action('lang_en', (ctx) => handleLanguageSelection(ctx, 'en'));
  bot.action('lang_ru', (ctx) => handleLanguageSelection(ctx, 'ru'));
  bot.action('lang_uz', (ctx) => handleLanguageSelection(ctx, 'uz'));
  bot.action('lang_tr', (ctx) => handleLanguageSelection(ctx, 'tr'));
  bot.action('change_language', handleChangeLanguage);

  // Main menu
  bot.action('main_menu', async (ctx) => {
    if (!ctx.from) return;

    const user = await userRepo.getUser(ctx.from.id);
    if (!user) return;

    const lang = user.language as Language;

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `${lang === 'en' ? 'main_menu' : 'main_menu'}`,
      getMainMenuKeyboard(lang)
    );
  });

  // ==========================================
  // CALCULATOR FLOW HANDLERS
  // ==========================================
  bot.action('calc_start', handleCalculatorStart);

  // Campus selection
  bot.action(/^campus_(.+)$/, async (ctx) => {
    const campusValue = ctx.match[1];

    // Handle campus comparison
    if (campusValue === 'compare') {
      if (!ctx.from) return;
      const user = await userRepo.getUser(ctx.from.id);
      if (!user) return;
      const lang = user.language as Language;
      const { t } = await import('../data/translations');

      await ctx.answerCbQuery();
      await ctx.reply(
        `🔍 ${t(lang, 'btn_campus_compare')}\n\n` +
        `📖 Learn more about the differences between our campuses:\n` +
        `${t(lang, 'campus_compare_url')}\n\n` +
        `Both campuses offer excellent education. MU Campus (Mirzo-Ulugbek) offers sibling discounts, ` +
        `while Yashnobod Campus offers special promotional discounts for 2025-2026.`
      );
    } else {
      // Handle normal campus selection
      const campus = campusValue as Campus;
      handleCampusSelection(ctx, campus);
    }
  });

  // Program selection
  bot.action(/^program_(.+)$/, (ctx) => {
    const programType = ctx.match[1] as ProgramType;
    handleProgramSelection(ctx, programType);
  });

  // Class selection (IB and Kindergarten programs)
  bot.action(/^class_(.+)$/, (ctx) => {
    const classLevel = ctx.match[1];
    handleClassSelection(ctx, classLevel);
  });

  // Russian school class selection (button-based grades 1-11)
  bot.action(/^rusclass_(\d+)$/, (ctx) => {
    const grade = parseInt(ctx.match[1]);
    handleRussianClassButtonSelection(ctx, grade);
  });

  // Number of children selection
  bot.action(/^children_(\d+)$/, (ctx) => {
    const numberOfChildren = parseInt(ctx.match[1]);
    handleChildrenSelection(ctx, numberOfChildren);
  });

  // Academic year selection
  bot.action(/^year_(.+)$/, (ctx) => {
    const year = ctx.match[1];
    handleYearSelection(ctx, year);
  });

  // Payment period selection
  bot.action(/^period_(.+)$/, (ctx) => {
    const period = ctx.match[1] as PaymentPeriod;
    handlePaymentPeriodSelection(ctx, period);
  });

  // Re-select program (back button from class selection)
  bot.action(/^select_program_(.+)$/, async (ctx) => {
    if (!ctx.from) return;

    const campus = ctx.match[1] as Campus;
    const user = await userRepo.getUser(ctx.from.id);
    if (!user) return;

    const lang = user.language as Language;
    const { getProgramKeyboard } = await import('./keyboards');

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `${lang === 'en' ? 'calc_select_program' : 'calc_select_program'}`,
      getProgramKeyboard(lang, campus)
    );
  });

  // Manager connection
  bot.action('connect_manager', handleConnectManager);

  // FAQ
  bot.action('faq', handleFaq);
  bot.action('faq_included', (ctx) => handleFaqTopic(ctx, 'included'));
  bot.action('faq_offer', (ctx) => handleFaqTopic(ctx, 'offer'));
  bot.action('faq_admission', (ctx) => handleFaqTopic(ctx, 'admission'));
  bot.action('faq_schedule', (ctx) => handleFaqTopic(ctx, 'schedule'));

  // Contact info
  bot.action('contact_info', handleContactInfo);

  // Admin callbacks
  bot.action('admin_stats', handleAdminStats);
  bot.action('admin_intercept', handleAdminIntercept);
  bot.action('admin_broadcast', handleAdminBroadcast);
  bot.action('broadcast_confirm', (ctx) => handleBroadcastConfirm(ctx, bot));
  bot.action('broadcast_cancel', handleBroadcastCancel);

  // Handle text messages
  bot.on('text', async (ctx) => {
    if (!ctx.from || !('text' in ctx.message)) return;

    const messageText = ctx.message.text;
    const user = await userRepo.getUser(ctx.from.id);

    if (!user) {
      // User not initialized, start the bot
      await handleStart(ctx);
      return;
    }

    const lang = user.language as Language;
    const session = await sessionRepo.getSession(ctx.from.id);

    // Log conversation
    await conversationRepo.logMessage(user.id, messageText, undefined, 'user');

    // Check if admin is in broadcast input mode
    if (isAdmin(ctx.from.id) && session?.currentStep === 'admin_broadcast_input') {
      await handleBroadcastInput(ctx);
      return;
    }

    // Check if user is entering Russian class grade
    if (session?.currentStep === 'enter_class_rus') {
      const grade = parseInt(messageText);
      if (!isNaN(grade)) {
        await handleRussianClassInput(ctx, grade);
        return;
      }
    }

    // Intercept mode for admins
    if (!isAdmin(ctx.from.id)) {
      await interceptUserMessage(ctx, bot);
    }

    // Default: show help or main menu
    const { t } = await import('../data/translations');
    await ctx.reply(t(lang, 'main_menu'), getMainMenuKeyboard(lang));
  });

  // Handle contact sharing (phone number)
  bot.on('contact', (ctx) => handlePhoneNumber(ctx, bot));

  // Error handling
  bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('An error occurred. Please try again or contact support.').catch(console.error);
  });

  return bot;
}
