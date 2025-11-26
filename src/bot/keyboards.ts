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

export function getCampusKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'campus_mu'), 'campus_MU')],
    [Markup.button.callback(t(lang, 'campus_yash'), 'campus_YASH')],
    [Markup.button.callback(t(lang, 'btn_back'), 'main_menu')],
  ]);
}

export function getProgramKeyboard(lang: Language, campus: Campus) {
  const buttons = [];

  if (campus === 'MU') {
    buttons.push([Markup.button.callback(t(lang, 'program_ib'), 'program_IB')]);
    buttons.push([Markup.button.callback(t(lang, 'program_rus'), 'program_RUS')]);
    buttons.push([Markup.button.callback(t(lang, 'program_kg_rus'), 'program_KG_RUS')]);
  } else {
    // YASH
    buttons.push([Markup.button.callback(t(lang, 'program_ib'), 'program_IB')]);
    buttons.push([Markup.button.callback(t(lang, 'program_rus'), 'program_RUS')]);
    buttons.push([Markup.button.callback(t(lang, 'program_kg_bi'), 'program_KG_BI')]);
  }

  buttons.push([Markup.button.callback(t(lang, 'btn_back'), 'calc_start')]);

  return Markup.inlineKeyboard(buttons);
}

export function getClassKeyboard(lang: Language, campus: Campus, programType: string) {
  const buttons = [];

  if (programType === 'IB') {
    // IB classes
    buttons.push([Markup.button.callback('KG', 'class_KG')]);
    buttons.push([
      Markup.button.callback('PYP 1', 'class_PYP1'),
      Markup.button.callback('PYP 2', 'class_PYP2'),
      Markup.button.callback('PYP 3', 'class_PYP3'),
    ]);
    buttons.push([
      Markup.button.callback('PYP 4', 'class_PYP4'),
      Markup.button.callback('PYP 5', 'class_PYP5'),
    ]);

    if (campus === 'MU') {
      buttons.push([
        Markup.button.callback('MYP 1', 'class_MYP1'),
        Markup.button.callback('MYP 2', 'class_MYP2'),
        Markup.button.callback('MYP 3', 'class_MYP3'),
      ]);
      buttons.push([
        Markup.button.callback('MYP 4', 'class_MYP4'),
        Markup.button.callback('MYP 5', 'class_MYP5'),
      ]);
      buttons.push([
        Markup.button.callback('DP 1', 'class_DP1'),
        Markup.button.callback('DP 2', 'class_DP2'),
      ]);
    } else {
      // YASH only has MYP 1-5
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
    buttons.push([Markup.button.callback('KG', 'class_KG')]);
  }
  // For RUS program, we'll ask user to type the grade

  buttons.push([Markup.button.callback(t(lang, 'btn_back'), `select_program_${campus}`)]);

  return Markup.inlineKeyboard(buttons);
}

export function getNumberOfChildrenKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_1_child'), 'children_1')],
    [Markup.button.callback(t(lang, 'btn_2_children'), 'children_2')],
    [Markup.button.callback(t(lang, 'btn_3_children'), 'children_3')],
  ]);
}

export function getYearKeyboard(lang: Language) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, 'btn_year_2025_26'), 'year_2025-2026')],
    [Markup.button.callback(t(lang, 'btn_year_other'), 'year_other')],
  ]);
}

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
