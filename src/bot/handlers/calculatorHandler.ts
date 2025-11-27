// ==========================================
// CALCULATOR HANDLER
// Handles the tuition fee calculator flow
// ==========================================

import { Context } from 'telegraf';
import { UserRepository } from '../../database/repositories/UserRepository';
import { SessionRepository } from '../../database/repositories/SessionRepository';
import { ConversationRepository } from '../../database/repositories/ConversationRepository';
import { t } from '../../data/translations';
import { Language, Campus, ProgramType, PaymentPeriod } from '../../types';
import {
  getCampusKeyboard,
  getProgramKeyboard,
  getClassKeyboard,
  getRussianClassKeyboard,
  getNumberOfChildrenKeyboard,
  getYearKeyboard,
  getPaymentPeriodKeyboard,
  getBackToMenuKeyboard,
} from '../keyboards';
import { priceCalculator } from '../../services/PriceCalculator';

// ==========================================
// REPOSITORY INSTANCES
// ==========================================
const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();
const conversationRepo = new ConversationRepository();

// ==========================================
// CALCULATOR START
// Shows introduction with discount information
// ==========================================
export async function handleCalculatorStart(ctx: Context) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Clear session and start fresh
  await sessionRepo.clearSession(ctx.from.id);
  await sessionRepo.setStep(ctx.from.id, 'show_intro');

  await ctx.answerCbQuery();

  // Show introduction message with discount information
  const introMessage = t(lang, 'calc_intro') + '\n\n' + t(lang, 'calc_select_campus');
  await ctx.editMessageText(introMessage, getCampusKeyboard(lang));
}

// ==========================================
// CAMPUS SELECTION HANDLER
// ==========================================
export async function handleCampusSelection(ctx: Context, campus: Campus) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Save selected campus to session
  await sessionRepo.updateSession(ctx.from.id, { campus });
  await sessionRepo.setStep(ctx.from.id, 'select_program');

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'calc_select_program'), getProgramKeyboard(lang, campus));
}

// ==========================================
// PROGRAM SELECTION HANDLER
// ==========================================
export async function handleProgramSelection(ctx: Context, programType: ProgramType) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;
  const session = await sessionRepo.getSession(ctx.from.id);

  if (!session?.campus) {
    await ctx.answerCbQuery('Please select campus first');
    return;
  }

  // Save selected program to session
  await sessionRepo.updateSession(ctx.from.id, { programType });

  // If Russian school, show button selection for grade (1-11)
  if (programType === 'RUS') {
    await sessionRepo.setStep(ctx.from.id, 'select_class_rus');
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      t(lang, 'calc_select_class_rus'),
      getRussianClassKeyboard(lang, session.campus as Campus)
    );
    return;
  }

  // For other programs (IB, KG), show class keyboard
  await sessionRepo.setStep(ctx.from.id, 'select_class');
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    t(lang, 'calc_select_class'),
    getClassKeyboard(lang, session.campus as Campus, programType)
  );
}

// ==========================================
// CLASS/GRADE LEVEL SELECTION HANDLER (IB, KG programs)
// ==========================================
export async function handleClassSelection(ctx: Context, classLevel: string) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Save selected class level to session
  await sessionRepo.updateSession(ctx.from.id, { classLevel });
  await sessionRepo.setStep(ctx.from.id, 'select_children');

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'calc_number_of_children'), getNumberOfChildrenKeyboard(lang));
}

// ==========================================
// RUSSIAN SCHOOL CLASS BUTTON SELECTION HANDLER
// Handles button-based selection for Russian school grades (1-11)
// ==========================================
export async function handleRussianClassButtonSelection(ctx: Context, grade: number) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Map grade number to class level key for pricing
  let classLevel: string;
  if (grade >= 1 && grade <= 4) {
    classLevel = '1-4';  // Primary school
  } else if (grade >= 5 && grade <= 8) {
    classLevel = '5-8';  // Middle school
  } else if (grade >= 9 && grade <= 11) {
    classLevel = '9-11'; // High school
  } else {
    await ctx.answerCbQuery(t(lang, 'error_invalid_input'));
    return;
  }

  // Save class level to session
  await sessionRepo.updateSession(ctx.from.id, { classLevel });
  await sessionRepo.setStep(ctx.from.id, 'select_children');

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'calc_number_of_children'), getNumberOfChildrenKeyboard(lang));
}

// ==========================================
// LEGACY: Russian Class Text Input Handler
// This is kept for backward compatibility but should not be used
// as we now use button-based selection
// ==========================================
export async function handleRussianClassInput(ctx: Context, grade: number) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Validate grade
  if (grade < 1 || grade > 11) {
    await ctx.reply(t(lang, 'error_invalid_input'));
    return;
  }

  // Map grade to class level key
  let classLevel: string;
  if (grade >= 1 && grade <= 4) {
    classLevel = '1-4';
  } else if (grade >= 5 && grade <= 8) {
    classLevel = '5-8';
  } else {
    classLevel = '9-11';
  }

  await sessionRepo.updateSession(ctx.from.id, { classLevel });
  await sessionRepo.setStep(ctx.from.id, 'select_children');

  await ctx.reply(t(lang, 'calc_number_of_children'), getNumberOfChildrenKeyboard(lang));
}

// ==========================================
// NUMBER OF CHILDREN SELECTION HANDLER
// Important for calculating sibling discounts (MU campus)
// ==========================================
export async function handleChildrenSelection(ctx: Context, numberOfChildren: number) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Save number of children to session
  await sessionRepo.updateSession(ctx.from.id, { numberOfChildren });
  await sessionRepo.setStep(ctx.from.id, 'select_year');

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'calc_select_year'), getYearKeyboard(lang));
}

// ==========================================
// ACADEMIC YEAR SELECTION HANDLER
// ==========================================
export async function handleYearSelection(ctx: Context, year: string) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;

  // Save selected year to session
  await sessionRepo.updateSession(ctx.from.id, { year });
  await sessionRepo.setStep(ctx.from.id, 'select_payment_period');

  await ctx.answerCbQuery();
  await ctx.editMessageText(t(lang, 'calc_select_payment_period'), getPaymentPeriodKeyboard(lang));
}

// ==========================================
// PAYMENT PERIOD SELECTION & FINAL CALCULATION
// Calculates tuition fees and applies all discounts
// ==========================================
export async function handlePaymentPeriodSelection(ctx: Context, period: PaymentPeriod) {
  if (!ctx.from) return;

  const user = await userRepo.getUser(ctx.from.id);
  if (!user) return;

  const lang = user.language as Language;
  const session = await sessionRepo.getSession(ctx.from.id);

  if (!session) {
    await ctx.answerCbQuery('Session expired. Please start again.');
    return;
  }

  await ctx.answerCbQuery();

  // Perform calculation
  try {
    const result = priceCalculator.calculate({
      campus: session.campus as Campus,
      programType: session.programType as ProgramType,
      classLevel: session.classLevel!,
      numberOfChildren: session.numberOfChildren!,
      year: session.year!,
      paymentPeriod: period,
    });

    // Format result message
    let message = t(lang, 'calc_result_title');
    message += `\n${t(lang, 'calc_campus')}${session.campus}`;
    message += `\n${t(lang, 'calc_program')}${session.programType}`;
    message += `\n${t(lang, 'calc_class')}${session.classLevel}`;
    message += `\n${t(lang, 'calc_year')}${session.year}`;
    message += `\n${t(lang, 'calc_payment_period')}${t(lang, period)}`;

    message += t(lang, 'calc_breakdown_title');

    // Show breakdown for each child
    result.breakdown.forEach((child) => {
      message += `\n${t(lang, 'calc_child')}${child.childNumber}:`;
      message += `\n  ${t(lang, 'calc_base_price')}${priceCalculator.formatPrice(child.basePrice)} ${t(lang, 'sum')}`;
      if (child.discount > 0) {
        message += `\n  ${t(lang, 'calc_discount')}${child.discount}%`;
      }
      message += `\n  ${t(lang, 'calc_final_price')}${priceCalculator.formatPrice(child.discountedPrice)} ${t(lang, 'sum')}`;
    });

    // Total
    const periodText = period === 'month' ? 'calc_per_month' : period === 'quarter' ? 'calc_per_quarter' : 'calc_per_year';
    message += `\n${t(lang, 'calc_total')}${t(lang, period)}: ${priceCalculator.formatPrice(result.totalPrice)} ${t(lang, 'sum')}${t(lang, periodText)}`;

    // Entry fee
    if (result.entryFee) {
      message += `${t(lang, 'calc_entry_fee')}${priceCalculator.formatPrice(result.entryFee)} ${t(lang, 'sum')}`;
    }

    // Discounts
    if (result.discountsApplied.length > 0) {
      message += t(lang, 'calc_discounts_applied');
      result.discountsApplied.forEach((discount) => {
        message += `• ${discount}\n`;
      });
    }

    // Annual savings
    if (result.annualSavings && result.annualSavings > 0) {
      message += `${t(lang, 'calc_annual_savings')}${priceCalculator.formatPrice(result.annualSavings)} ${t(lang, 'sum')}`;
    }

    await ctx.editMessageText(message, getBackToMenuKeyboard(lang));

    // Log conversation
    await conversationRepo.logMessage(
      user.id,
      'Price calculation',
      message,
      'calculation',
      { session: session, result }
    );

    // Clear session
    await sessionRepo.clearSession(ctx.from.id);
  } catch (error) {
    console.error('Calculation error:', error);
    await ctx.editMessageText(t(lang, 'error_general'), getBackToMenuKeyboard(lang));
  }
}
