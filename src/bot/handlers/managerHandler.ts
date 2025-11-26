import { Context, Telegraf } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { LeadRepository } from '../../database/repositories/LeadRepository';
import { SessionRepository } from '../../database/repositories/SessionRepository';
import { t } from '../../data/translations';
import { Language, Campus, ProgramType } from '../../types';
import { getSharePhoneKeyboard, getMainMenuKeyboard } from '../keyboards';
import { config } from '../../config';

const userRepo = new UserRepository();
const leadRepo = new LeadRepository();
const sessionRepo = new SessionRepository();

export async function handleConnectManager(ctx: Context) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Set session step to wait for phone number
  await sessionRepo.setStep(ctx.from.id, 'connect_manager_phone');

  await ctx.answerCbQuery();
  await ctx.reply(t(lang, 'connect_prompt'), getSharePhoneKeyboard(lang));
}

export async function handlePhoneNumber(ctx: Context, bot: Telegraf) {
  if (!ctx.from || !('contact' in ctx.message!)) return;

  const contact = (ctx.message as any).contact;
  const phoneNumber = contact.phone_number;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Save phone number
  await userRepo.setPhoneNumber(ctx.from.id, phoneNumber);

  // Get session data (if they calculated price before)
  const session = await sessionRepo.getSession(ctx.from.id);

  // Create lead
  const lead = await leadRepo.createLead({
    userId: user.id,
    phoneNumber,
    campus: session?.campus as Campus,
    programType: session?.programType as ProgramType,
    classLevel: session?.classLevel,
    numberOfChildren: session?.numberOfChildren,
    year: session?.year,
  });

  // Send notification to CRM channel
  if (config.crmChannelId) {
    try {
      let crmMessage = `${t(lang, 'connect_sent_to_crm')}\n\n`;
      crmMessage += `👤 Name: ${user.firstName || ''} ${user.lastName || ''}\n`;
      crmMessage += `📱 Phone: ${phoneNumber}\n`;
      if (user.username) {
        crmMessage += `🔗 Username: @${user.username}\n`;
      }
      crmMessage += `🆔 Telegram ID: ${user.telegramId}\n`;
      crmMessage += `🌐 Language: ${lang.toUpperCase()}\n`;

      if (session) {
        crmMessage += `\n📊 Calculation Details:\n`;
        if (session.campus) crmMessage += `🏫 Campus: ${session.campus}\n`;
        if (session.programType) crmMessage += `📚 Program: ${session.programType}\n`;
        if (session.classLevel) crmMessage += `🎒 Class: ${session.classLevel}\n`;
        if (session.numberOfChildren) crmMessage += `👨‍👩‍👧‍👦 Children: ${session.numberOfChildren}\n`;
        if (session.year) crmMessage += `📅 Year: ${session.year}\n`;
      }

      crmMessage += `\n🔗 Lead ID: #${lead.id}`;

      // Send to CRM channel
      await bot.telegram.sendMessage(config.crmChannelId, crmMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📞 Connect Now',
                url: `tg://user?id=${user.telegramId}`,
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error sending to CRM channel:', error);
    }
  }

  // Confirm to user
  await ctx.reply(t(lang, 'connect_success'), {
    reply_markup: { remove_keyboard: true },
  });

  await ctx.reply(t(lang, 'main_menu'), getMainMenuKeyboard(lang));

  // Clear session
  await sessionRepo.clearSession(ctx.from.id);
}
