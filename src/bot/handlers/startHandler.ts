import { Context } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { SessionRepository } from '../../database/repositories/SessionRepository';
import { t } from '../../data/translations';
import { getLanguageKeyboard, getMainMenuKeyboard } from '../keyboards';
import { Language } from '../../types';

const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();

export async function handleStart(ctx: Context) {
  if (!ctx.from) return;

  // Find or create user
  const user = await userRepo.findOrCreate(
    ctx.from.id,
    ctx.from.username,
    ctx.from.first_name,
    ctx.from.last_name
  );

  // Clear any existing session
  await sessionRepo.clearSession(ctx.from.id);

  // If user already has a language preference, show main menu
  if (user.language) {
    await ctx.reply(t(user.language as Language, 'main_menu'), getMainMenuKeyboard(user.language as Language));
  } else {
    // Show language selection
    await ctx.reply(t('en', 'welcome'), getLanguageKeyboard());
  }
}
