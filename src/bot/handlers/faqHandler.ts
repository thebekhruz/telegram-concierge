import { Context } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { t } from '../../data/translations';
import { Language } from '../../types';
import { getFaqKeyboard, getBackToMenuKeyboard } from '../keyboards';

const userRepo = new UserRepository();

export async function handleFaq(ctx: Context) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'faq_title'), getFaqKeyboard(lang));
}

export async function handleFaqTopic(ctx: Context, topic: string) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  let questionKey = '';
  let answerKey = '';

  switch (topic) {
    case 'included':
      questionKey = 'faq_what_included';
      answerKey = 'faq_what_included_answer';
      break;
    case 'offer':
      questionKey = 'faq_what_we_offer';
      answerKey = 'faq_what_we_offer_answer';
      break;
    case 'admission':
      questionKey = 'faq_admission_process';
      answerKey = 'faq_admission_process_answer';
      break;
    case 'schedule':
      questionKey = 'faq_schedule';
      answerKey = 'faq_schedule_answer';
      break;
  }

  if (questionKey && answerKey) {
    const message = `${t(lang, questionKey)}\n\n${t(lang, answerKey)}`;

    await ctx.answerCbQuery();

    // Send as a new message (quick view)
    await ctx.reply(message, getBackToMenuKeyboard(lang));
  }
}
