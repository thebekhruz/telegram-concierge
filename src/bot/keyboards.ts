import { Markup } from 'telegraf';
import { Language, Campus } from '../types';
import { t } from '../data/translations';

export function getLanguageKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('English 🇬🇧', 'lang_en'),
      Markup.button.callback('Русский 🇷🇺', 'lang_ru'),
    ],
    [
      Markup.button.callback('O\'zbekcha 🇺🇿', 'lang_uz'),
      Markup.button.callback('Türkçe 🇹🇷', 'lang_tr'),
    ],
  ]);
}

export function getMainMenuKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_price_calculator'), 'calc_start')],
    [Markup.button.callback(t(lang, 'btn_connect_manager'), 'connect_manager')],
    [Markup.button.callback(t(lang, 'btn_faq'), 'faq')],
    [Markup.button.callback(t(lang, 'btn_contact_info'), 'contact_info')],
    [Markup.button.callback(t(lang, 'btn_change_language'), 'change_language')],
  ]);
}

export function getBackToMenuKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_main_menu'), 'main_menu')],
  ]);
}

// ==========================================
// CAMPUS SELECTION KEYBOARD
// ==========================================
export function getCampusKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'campus_mu'), 'campus_MU')],
    [Markup.button.callback(t(lang, 'campus_yash'), 'campus_YASH')],
    [Markup.button.callback(t(lang, 'btn_campus_compare'), 'campus_compare')],
    [Markup.button.callback(t(lang, 'btn_back'), 'main_menu')],
  ]);
}

// ==========================================
// PROGRAM SELECTION KEYBOARD
// ==========================================
export function getProgramKeyboard(lang: Language, campus: Campus) {
  const buttons = [];

  if (campus === 'MU') {
    // MU Campus programs
    buttons.push([Markup.button.callback(t(lang, 'program_ib'), 'program_IB')]);
    buttons.push([Markup.button.callback(t(lang, 'program_rus'), 'program_RUS')]);
    buttons.push([Markup.button.callback(t(lang, 'program_kg_rus'), 'program_KG_RUS')]);
  } else {
    // YASH Campus programs
    buttons.push([Markup.button.callback(t(lang, 'program_ib'), 'program_IB')]);
    buttons.push([Markup.button.callback(t(lang, 'program_rus'), 'program_RUS')]);
    buttons.push([Markup.button.callback(t(lang, 'program_kg_bi'), 'program_KG_BI')]);
  }

  buttons.push([Markup.button.callback(t(lang, 'btn_back'), 'calc_start')]);

  return Markup.inlineKeyboard(buttons);
}

// ==========================================
// CLASS/GRADE LEVEL SELECTION KEYBOARD
// ==========================================
export function getClassKeyboard(lang: Language, campus: Campus, programType: string) {
  const buttons = [];

  if (programType === 'IB') {
    // IB Program - Kindergarten
    buttons.push([Markup.button.callback('KG', 'class_KG')]);

    // IB Program - Primary Years Programme (PYP)
    buttons.push([
      Markup.button.callback('PYP 1', 'class_PYP1'),
      Markup.button.callback('PYP 2', 'class_PYP2'),
      Markup.button.callback('PYP 3', 'class_PYP3'),
    ]);
    buttons.push([
      Markup.button.callback('PYP 4', 'class_PYP4'),
      Markup.button.callback('PYP 5', 'class_PYP5'),
    ]);

    // IB Program - Middle Years Programme (MYP)
    if (campus === 'MU') {
      // MU Campus has full IB program including DP
      buttons.push([
        Markup.button.callback('MYP 1', 'class_MYP1'),
        Markup.button.callback('MYP 2', 'class_MYP2'),
        Markup.button.callback('MYP 3', 'class_MYP3'),
      ]);
      buttons.push([
        Markup.button.callback('MYP 4', 'class_MYP4'),
        Markup.button.callback('MYP 5', 'class_MYP5'),
      ]);

      // IB Program - Diploma Programme (DP) - only at MU
      buttons.push([
        Markup.button.callback('DP 1', 'class_DP1'),
        Markup.button.callback('DP 2', 'class_DP2'),
      ]);
    } else {
      // YASH Campus only has MYP 1-5
      buttons.push([
        Markup.button.callback('MYP 1', 'class_MYP1'),
        Markup.button.callback('MYP 2', 'class_MYP2'),
        Markup.button.callback('MYP 3', 'class_MYP3'),
      ]);
      buttons.push([
        Markup.button.callback('MYP 4', 'class_MYP4'),
        Markup.button.callback('MYP 5', 'class_MYP5'),
      ]);
    }
  } else if (programType === 'KG_RUS' || programType === 'KG_BI') {
    // Kindergarten programs
    buttons.push([Markup.button.callback('KG', 'class_KG')]);
  }
  // For RUS program, use getRussianClassKeyboard() instead

  buttons.push([Markup.button.callback(t(lang, 'btn_back'), `select_program_${campus}`)]);

  return Markup.inlineKeyboard(buttons);
}

// ==========================================
// RUSSIAN SCHOOL CLASS NUMBER SELECTION
// ==========================================
export function getRussianClassKeyboard(lang: Language, campus: Campus) {
  const buttons = [];

  // Grades 1-4 (Primary school)
  buttons.push([
    Markup.button.callback('1', 'rusclass_1'),
    Markup.button.callback('2', 'rusclass_2'),
    Markup.button.callback('3', 'rusclass_3'),
    Markup.button.callback('4', 'rusclass_4'),
  ]);

  // Grades 5-8 (Middle school)
  buttons.push([
    Markup.button.callback('5', 'rusclass_5'),
    Markup.button.callback('6', 'rusclass_6'),
    Markup.button.callback('7', 'rusclass_7'),
    Markup.button.callback('8', 'rusclass_8'),
  ]);

  // Grades 9-11 (High school)
  buttons.push([
    Markup.button.callback('9', 'rusclass_9'),
    Markup.button.callback('10', 'rusclass_10'),
    Markup.button.callback('11', 'rusclass_11'),
  ]);

  // Back button
  buttons.push([Markup.button.callback(t(lang, 'btn_back'), `select_program_${campus}`)]);

  return Markup.inlineKeyboard(buttons);
}

// ==========================================
// NUMBER OF CHILDREN SELECTION
// Important for discount calculation (MU campus offers sibling discounts)
// ==========================================
export function getNumberOfChildrenKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_1_child'), 'children_1')],
    [Markup.button.callback(t(lang, 'btn_2_children'), 'children_2')],
    [Markup.button.callback(t(lang, 'btn_3_children'), 'children_3')],
  ]);
}

// ==========================================
// ACADEMIC YEAR SELECTION
// ==========================================
export function getYearKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_year_2025_26'), 'year_2025-2026')],
    [Markup.button.callback(t(lang, 'btn_year_other'), 'year_other')],
  ]);
}

// ==========================================
// PAYMENT PERIOD SELECTION
// Users can choose monthly, quarterly, or annual payment
// Annual payment comes with a 5% discount
// ==========================================
export function getPaymentPeriodKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_monthly'), 'period_month')],
    [Markup.button.callback(t(lang, 'btn_quarterly'), 'period_quarter')],
    [Markup.button.callback(t(lang, 'btn_annually'), 'period_year')],
  ]);
}

export function getSharePhoneKeyboard(lang: Language) {
  return Markup.keyboard([
    [Markup.button.contactRequest(t(lang, 'btn_share_phone'))],
  ]).resize();
}

export function getFaqKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_faq_included'), 'faq_included')],
    [Markup.button.callback(t(lang, 'btn_faq_offer'), 'faq_offer')],
    [Markup.button.callback(t(lang, 'btn_faq_admission'), 'faq_admission')],
    [Markup.button.callback(t(lang, 'btn_faq_schedule'), 'faq_schedule')],
    [Markup.button.callback(t(lang, 'btn_back'), 'main_menu')],
  ]);
}

export function getAdminKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_broadcast'), 'admin_broadcast')],
    [Markup.button.callback(t(lang, 'btn_view_stats'), 'admin_stats')],
    [Markup.button.callback(t(lang, 'btn_intercept_mode'), 'admin_intercept')],
    [Markup.button.callback(t(lang, 'btn_main_menu'), 'main_menu')],
  ]);
}

export function getBroadcastConfirmKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_confirm_send'), 'broadcast_confirm')],
    [Markup.button.callback(t(lang, 'btn_cancel'), 'broadcast_cancel')],
  ]);
}
