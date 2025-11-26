import { Context } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { t } from '../../data/translations';
import { Language } from '../../types';
import { getBackToMenuKeyboard } from '../keyboards';

const userRepo = new UserRepository();

export async function handleContactInfo(ctx: Context) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  let message = t(lang, 'contact_title');
  message += `\n${t(lang, 'contact_mu_campus')}`;
  message += `\n${t(lang, 'contact_mu_address')}`;
  message += `\n${t(lang, 'contact_mu_phone')}`;

  message += `${t(lang, 'contact_yash_campus')}`;
  message += `\n${t(lang, 'contact_yash_address')}`;
  message += `\n${t(lang, 'contact_yash_phone')}`;

  message += `${t(lang, 'contact_general')}`;
  message += `\n${t(lang, 'contact_email')}`;
  message += `\n${t(lang, 'contact_website')}`;

  message += `${t(lang, 'contact_social')}`;
  message += `\n${t(lang, 'contact_instagram')}`;
  message += `\n${t(lang, 'contact_facebook')}`;

  await ctx.answerCbQuery();
  await ctx.editMessageText(message, getBackToMenuKeyboard(lang));
}
