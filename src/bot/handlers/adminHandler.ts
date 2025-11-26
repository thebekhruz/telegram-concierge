import { Context, Telegraf } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { ConversationRepository } from '../../database/repositories/ConversationRepository';
import { LeadRepository } from '../../database/repositories/LeadRepository';
import { AdminStateRepository } from '../../database/repositories/AdminStateRepository';
import { SessionRepository } from '../../database/repositories/SessionRepository';
import { t } from '../../data/translations';
import { Language } from '../../types';
import { getAdminKeyboard, getBroadcastConfirmKeyboard, getMainMenuKeyboard } from '../keyboards';
import { config } from '../../config';

const userRepo = new UserRepository();
const conversationRepo = new ConversationRepository();
const leadRepo = new LeadRepository();
const adminStateRepo = new AdminStateRepository();
const sessionRepo = new SessionRepository();

export function isAdmin(userId: number): boolean {
  return config.adminUserIds.includes(userId);
}

export async function handleAdminCommand(ctx: Context) {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.reply(t('en', 'admin_not_authorized'));
    return;
  }

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  await ctx.reply(t(lang, 'admin_panel'), getAdminKeyboard(lang));
}

export async function handleAdminStats(ctx: Context) {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.answerCbQuery(t('en', 'admin_not_authorized'));
    return;
  }

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  const totalUsers = (await userRepo.getAllUsers()).length;
  const totalConversations = await conversationRepo.getTotalConversations();
  const totalLeads = await leadRepo.getTotalLeads();

  const message = t(lang, 'admin_stats', {
    users: totalUsers.toString(),
    conversations: totalConversations.toString(),
    leads: totalLeads.toString(),
  });

  await ctx.answerCbQuery();
  await ctx.editMessageText(message, getAdminKeyboard(lang));
}

export async function handleAdminIntercept(ctx: Context) {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.answerCbQuery(t('en', 'admin_not_authorized'));
    return;
  }

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  const currentState = await adminStateRepo.isInterceptMode(ctx.from.id);
  const newState = !currentState;

  await adminStateRepo.setInterceptMode(ctx.from.id, newState);

  const message = newState ? t(lang, 'admin_intercept_on') : t(lang, 'admin_intercept_off');

  await ctx.answerCbQuery();
  await ctx.editMessageText(message, getAdminKeyboard(lang));
}

export async function handleAdminBroadcast(ctx: Context) {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.answerCbQuery(t('en', 'admin_not_authorized'));
    return;
  }

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  // Set admin state to waiting for broadcast message
  await adminStateRepo.setCurrentAction(ctx.from.id, 'broadcast_input');
  await sessionRepo.setStep(ctx.from.id, 'admin_broadcast_input');

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'admin_broadcast_prompt'));
}

export async function handleBroadcastInput(ctx: Context) {
  if (!ctx.from || !isAdmin(ctx.from.id) || !('text' in ctx.message!)) return;

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  const messageText = (ctx.message as any).text;

  // Store the broadcast message
  await adminStateRepo.setCurrentAction(ctx.from.id, 'broadcast_confirm', {
    message: messageText,
  });
  await sessionRepo.setStep(ctx.from.id, 'admin_broadcast_confirm');

  // Show confirmation
  const confirmMessage = `${t(lang, 'admin_broadcast_confirm')}${messageText}`;
  await ctx.reply(confirmMessage, getBroadcastConfirmKeyboard(lang));
}

export async function handleBroadcastConfirm(ctx: Context, bot: Telegraf) {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.answerCbQuery(t('en', 'admin_not_authorized'));
    return;
  }

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  const adminState = await adminStateRepo.getAdminState(ctx.from.id);
  const broadcastMessage = adminState?.data?.message as string;

  if (!broadcastMessage) {
    await ctx.answerCbQuery('No message to broadcast');
    return;
  }

  await ctx.answerCbQuery('Sending broadcast...');

  // Get all users who can receive broadcasts
  const users = await userRepo.getBroadcastableUsers();

  let successCount = 0;
  let failCount = 0;

  // Send to all users
  for (const targetUser of users) {
    try {
      await bot.telegram.sendMessage(targetUser.telegramId, broadcastMessage);
      successCount++;
      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error) {
      console.error(`Failed to send to user ${targetUser.telegramId}:`, error);
      failCount++;
    }
  }

  const resultMessage = t(lang, 'admin_broadcast_success', { count: successCount.toString() });

  await ctx.editMessageText(resultMessage);
  await ctx.reply(t(lang, 'main_menu'), getMainMenuKeyboard(lang));

  // Clear admin state
  await adminStateRepo.clearAction(ctx.from.id);
  await sessionRepo.clearSession(ctx.from.id);
}

export async function handleBroadcastCancel(ctx: Context) {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.answerCbQuery(t('en', 'admin_not_authorized'));
    return;
  }

  const user = await userRepo.getUser(ctx.from.id);
  const lang = (user?.language as Language) || 'en';

  await adminStateRepo.clearAction(ctx.from.id);
  await sessionRepo.clearSession(ctx.from.id);

  await ctx.answerCbQuery('Cancelled');
  await ctx.editMessageText(t(lang, 'admin_panel'), getAdminKeyboard(lang));
}

// Intercept mode: forward user messages to admin
export async function interceptUserMessage(ctx: Context, bot: Telegraf) {
  if (!ctx.from || !('text' in ctx.message!)) return;

  const messageText = (ctx.message as any).text;

  // Find all admins in intercept mode
  for (const adminId of config.adminUserIds) {
    const isIntercept = await adminStateRepo.isInterceptMode(adminId);
    if (isIntercept) {
      try {
        const forwardMessage = `📨 Message from user ${ctx.from.id} (@${ctx.from.username || 'no username'}):\n\n${messageText}`;
        await bot.telegram.sendMessage(adminId, forwardMessage);
      } catch (error) {
        console.error(`Failed to forward to admin ${adminId}:`, error);
      }
    }
  }
}
