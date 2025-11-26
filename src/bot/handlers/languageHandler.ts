import { Context } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { t } from '../../data/translations';
import { Language } from '../../types';
import { getLanguageKeyboard, getMainMenuKeyboard } from '../keyboards';

const userRepo = new UserRepository();

export async function handleLanguageSelection(ctx: Context, language: Language) {
  if (!ctx.from) return;

  await userRepo.setLanguage(ctx.from.id, language);

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(language, 'language_selected'));
  await ctx.reply(t(language, 'main_menu'), getMainMenuKeyboard(language));
}

export async function handleChangeLanguage(ctx: Context) {
  await ctx.answerCbQuery();
  await ctx.editMessageText(t('en', 'welcome'), getLanguageKeyboard());
}
