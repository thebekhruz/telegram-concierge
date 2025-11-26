import { Language } from '../types';

type TranslationKey = string;
type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  en: {
    // Welcome & Language Selection
    welcome:
      '🎓 Welcome to Oxbridge International School!\n\nPlease select your preferred language:',
    language_selected: 'Language set to English 🇬🇧',

    // Main Menu
    main_menu: '📋 Main Menu\n\nHow can I help you today?',
    btn_price_calculator: '💰 Calculate Tuition',
    btn_connect_manager: '👤 Connect with Manager',
    btn_faq: '❓ FAQ',
    btn_contact_info: '📞 Contact Information',
    btn_change_language: '🌐 Change Language',
    btn_back: '⬅️ Back',
    btn_main_menu: '🏠 Main Menu',

    // Price Calculator
    calc_select_campus: '🏫 Please select a campus:',
    campus_mu: 'MU Campus (Mirzo-Ulugbek)',
    campus_yash: 'Yashnobod Campus',

    calc_select_program: '📚 Please select a program:',
    program_ib: 'International Baccalaureate (IB)',
    program_rus: 'Russian School',
    program_kg_rus: 'Russian Kindergarten',
    program_kg_bi: 'Bilingual Kindergarten',

    calc_select_class: '🎒 Please select the class/grade level:',
    calc_enter_class_rus: 'Please enter the grade number (1-11):',

    calc_number_of_children: '👨‍👩‍👧‍👦 How many children will attend Oxbridge in 2025-2026?',
    btn_1_child: '1 child',
    btn_2_children: '2 children',
    btn_3_children: '3+ children',

    calc_select_year: '📅 Which academic year are you interested in?',
    btn_year_2025_26: '2025-2026',
    btn_year_other: 'Other year',

    calc_select_payment_period: '💳 Select payment period:',
    btn_monthly: 'Monthly',
    btn_quarterly: 'Quarterly',
    btn_annually: 'Annually (with discount)',

    // Calculation Result
    calc_result_title: '📊 TUITION CALCULATION RESULT\n',
    calc_campus: 'Campus: ',
    calc_program: 'Program: ',
    calc_class: 'Class: ',
    calc_year: 'Year: ',
    calc_payment_period: 'Payment Period: ',
    calc_breakdown_title: '\n💵 Price Breakdown:\n',
    calc_child: 'Child #',
    calc_base_price: 'Base price: ',
    calc_discount: 'Discount: ',
    calc_final_price: 'Final price: ',
    calc_total: '\n💰 Total per ',
    calc_entry_fee: '\n🎫 Entry Fee: ',
    calc_discounts_applied: '\n🎁 Discounts Applied:\n',
    calc_annual_savings: '\n✨ Annual Savings (if paid annually): ',
    calc_per_month: '/month',
    calc_per_quarter: '/quarter',
    calc_per_year: '/year',

    // Connect to Manager
    connect_prompt:
      '👤 Great! To connect you with a personal manager, please share your contact number:',
    btn_share_phone: '📱 Share Phone Number',
    connect_success:
      '✅ Thank you! Your request has been sent to our admissions team. A manager will contact you shortly!',
    connect_sent_to_crm: '📩 New lead from bot',

    // FAQ
    faq_title: '❓ Frequently Asked Questions',
    faq_what_included: '📦 What is included in tuition?',
    faq_what_included_answer:
      'Tuition includes:\n• Full academic program\n• Learning materials\n• Access to school facilities\n• Extracurricular activities\n• Daily meals (breakfast, lunch, snacks)\n• School transport (optional, separate fee)',

    faq_what_we_offer: '🎓 What do we offer?',
    faq_what_we_offer_answer:
      'Oxbridge International School offers:\n• IB World School programs (PYP, MYP, DP)\n• Russian curriculum (grades 1-11)\n• Bilingual education\n• Modern facilities\n• Experienced international faculty\n• Small class sizes\n• Individual approach to each student',

    faq_admission_process: '📝 What is the admission process?',
    faq_admission_process_answer:
      'Admission process:\n1. Submit application\n2. Entrance assessment\n3. Interview with parents and student\n4. Receive admission decision\n5. Complete enrollment',

    faq_schedule: '🕐 What is the school schedule?',
    faq_schedule_answer:
      'School hours:\n• Monday - Friday: 8:30 AM - 3:30 PM\n• After-school activities: until 5:00 PM\n• Full day program available',

    btn_faq_included: '📦 What\'s included?',
    btn_faq_offer: '🎓 Our programs',
    btn_faq_admission: '📝 Admission process',
    btn_faq_schedule: '🕐 School schedule',

    // Contact Info
    contact_title: '📞 CONTACT INFORMATION\n',
    contact_mu_campus: '🏫 MU Campus (Mirzo-Ulugbek)',
    contact_mu_address: '📍 Address: Tashkent, Mirzo-Ulugbek district',
    contact_mu_phone: '📱 Phone: +998 XX XXX XX XX',
    contact_yash_campus: '\n🏫 Yashnobod Campus',
    contact_yash_address: '📍 Address: Tashkent, Yashnobod district',
    contact_yash_phone: '📱 Phone: +998 XX XXX XX XX',
    contact_general: '\n📧 General Inquiries',
    contact_email: 'Email: info@oxbridge.uz',
    contact_website: '🌐 Website: www.oxbridge.uz',
    contact_social: '\n📱 Social Media',
    contact_instagram: 'Instagram: @oxbridge_school',
    contact_facebook: 'Facebook: OxbridgeSchool',

    // Admin Panel
    admin_panel: '⚙️ ADMIN PANEL',
    btn_broadcast: '📢 Broadcast Message',
    btn_view_stats: '📊 View Statistics',
    btn_intercept_mode: '🎯 Intercept Mode',
    admin_broadcast_prompt: 'Send the message you want to broadcast to all users:',
    admin_broadcast_confirm: 'Send this message to all users?\n\nPreview:\n',
    btn_confirm_send: '✅ Confirm Send',
    btn_cancel: '❌ Cancel',
    admin_broadcast_success: '✅ Message sent to {count} users',
    admin_intercept_on: '🎯 Intercept mode: ON\nYou will receive all user messages.',
    admin_intercept_off: '🎯 Intercept mode: OFF',
    admin_stats: '📊 Statistics\n\nTotal users: {users}\nTotal conversations: {conversations}\nTotal leads: {leads}',
    admin_not_authorized: '❌ You are not authorized to access the admin panel.',

    // Errors
    error_invalid_input: '❌ Invalid input. Please try again.',
    error_general: '❌ Something went wrong. Please try again or contact support.',

    // Misc
    month: 'month',
    quarter: 'quarter',
    year: 'year',
    sum: 'UZS',
  },

  ru: {
    // Welcome & Language Selection
    welcome:
      '🎓 Добро пожаловать в Oxbridge International School!\n\nПожалуйста, выберите предпочитаемый язык:',
    language_selected: 'Язык установлен на Русский 🇷🇺',

    // Main Menu
    main_menu: '📋 Главное меню\n\nКак я могу вам помочь?',
    btn_price_calculator: '💰 Рассчитать стоимость',
    btn_connect_manager: '👤 Связаться с менеджером',
    btn_faq: '❓ Частые вопросы',
    btn_contact_info: '📞 Контактная информация',
    btn_change_language: '🌐 Изменить язык',
    btn_back: '⬅️ Назад',
    btn_main_menu: '🏠 Главное меню',

    // Price Calculator
    calc_select_campus: '🏫 Пожалуйста, выберите кампус:',
    campus_mu: 'Кампус МУ (Мирзо-Улугбек)',
    campus_yash: 'Кампус Яшнобод',

    calc_select_program: '📚 Пожалуйста, выберите программу:',
    program_ib: 'Международный бакалавриат (IB)',
    program_rus: 'Русская школа',
    program_kg_rus: 'Русский детский сад',
    program_kg_bi: 'Билингвальный детский сад',

    calc_select_class: '🎒 Пожалуйста, выберите класс/уровень:',
    calc_enter_class_rus: 'Пожалуйста, введите номер класса (1-11):',

    calc_number_of_children: '👨‍👩‍👧‍👦 Сколько детей будут учиться в Oxbridge в 2025-2026?',
    btn_1_child: '1 ребёнок',
    btn_2_children: '2 ребёнка',
    btn_3_children: '3+ детей',

    calc_select_year: '📅 Какой учебный год вас интересует?',
    btn_year_2025_26: '2025-2026',
    btn_year_other: 'Другой год',

    calc_select_payment_period: '💳 Выберите период оплаты:',
    btn_monthly: 'Ежемесячно',
    btn_quarterly: 'Ежеквартально',
    btn_annually: 'Ежегодно (со скидкой)',

    // Calculation Result
    calc_result_title: '📊 РЕЗУЛЬТАТ РАСЧЁТА СТОИМОСТИ\n',
    calc_campus: 'Кампус: ',
    calc_program: 'Программа: ',
    calc_class: 'Класс: ',
    calc_year: 'Год: ',
    calc_payment_period: 'Период оплаты: ',
    calc_breakdown_title: '\n💵 Детализация цены:\n',
    calc_child: 'Ребёнок #',
    calc_base_price: 'Базовая цена: ',
    calc_discount: 'Скидка: ',
    calc_final_price: 'Итоговая цена: ',
    calc_total: '\n💰 Итого за ',
    calc_entry_fee: '\n🎫 Вступительный взнос: ',
    calc_discounts_applied: '\n🎁 Применённые скидки:\n',
    calc_annual_savings: '\n✨ Экономия при годовой оплате: ',
    calc_per_month: '/месяц',
    calc_per_quarter: '/квартал',
    calc_per_year: '/год',

    // Connect to Manager
    connect_prompt:
      '👤 Отлично! Чтобы связать вас с персональным менеджером, пожалуйста, поделитесь своим контактным номером:',
    btn_share_phone: '📱 Поделиться номером',
    connect_success:
      '✅ Спасибо! Ваш запрос отправлен нашей приёмной комиссии. Менеджер свяжется с вами в ближайшее время!',
    connect_sent_to_crm: '📩 Новый лид из бота',

    // FAQ
    faq_title: '❓ Частые вопросы',
    faq_what_included: '📦 Что включено в стоимость обучения?',
    faq_what_included_answer:
      'В стоимость включено:\n• Полная учебная программа\n• Учебные материалы\n• Доступ к школьным помещениям\n• Внеклассные мероприятия\n• Ежедневное питание (завтрак, обед, перекусы)\n• Школьный транспорт (опционально, отдельная оплата)',

    faq_what_we_offer: '🎓 Что мы предлагаем?',
    faq_what_we_offer_answer:
      'Oxbridge International School предлагает:\n• Программы IB World School (PYP, MYP, DP)\n• Российская учебная программа (1-11 классы)\n• Билингвальное образование\n• Современное оборудование\n• Опытные международные преподаватели\n• Малые классы\n• Индивидуальный подход к каждому ученику',

    faq_admission_process: '📝 Каков процесс поступления?',
    faq_admission_process_answer:
      'Процесс поступления:\n1. Подача заявки\n2. Вступительное тестирование\n3. Собеседование с родителями и учеником\n4. Получение решения о приёме\n5. Оформление документов',

    faq_schedule: '🕐 Каково расписание школы?',
    faq_schedule_answer:
      'Часы работы:\n• Понедельник - Пятница: 8:30 - 15:30\n• Внеклассные занятия: до 17:00\n• Доступна программа полного дня',

    btn_faq_included: '📦 Что включено?',
    btn_faq_offer: '🎓 Наши программы',
    btn_faq_admission: '📝 Процесс поступления',
    btn_faq_schedule: '🕐 Расписание',

    // Contact Info
    contact_title: '📞 КОНТАКТНАЯ ИНФОРМАЦИЯ\n',
    contact_mu_campus: '🏫 Кампус МУ (Мирзо-Улугбек)',
    contact_mu_address: '📍 Адрес: Ташкент, район Мирзо-Улугбек',
    contact_mu_phone: '📱 Телефон: +998 XX XXX XX XX',
    contact_yash_campus: '\n🏫 Кампус Яшнобод',
    contact_yash_address: '📍 Адрес: Ташкент, Яшнободский район',
    contact_yash_phone: '📱 Телефон: +998 XX XXX XX XX',
    contact_general: '\n📧 Общие вопросы',
    contact_email: 'Email: info@oxbridge.uz',
    contact_website: '🌐 Сайт: www.oxbridge.uz',
    contact_social: '\n📱 Социальные сети',
    contact_instagram: 'Instagram: @oxbridge_school',
    contact_facebook: 'Facebook: OxbridgeSchool',

    // Admin Panel
    admin_panel: '⚙️ ПАНЕЛЬ АДМИНИСТРАТОРА',
    btn_broadcast: '📢 Рассылка',
    btn_view_stats: '📊 Статистика',
    btn_intercept_mode: '🎯 Режим перехвата',
    admin_broadcast_prompt: 'Отправьте сообщение для рассылки всем пользователям:',
    admin_broadcast_confirm: 'Отправить это сообщение всем пользователям?\n\nПредпросмотр:\n',
    btn_confirm_send: '✅ Подтвердить отправку',
    btn_cancel: '❌ Отмена',
    admin_broadcast_success: '✅ Сообщение отправлено {count} пользователям',
    admin_intercept_on: '🎯 Режим перехвата: ВКЛ\nВы будете получать все сообщения пользователей.',
    admin_intercept_off: '🎯 Режим перехвата: ВЫКЛ',
    admin_stats: '📊 Статистика\n\nВсего пользователей: {users}\nВсего диалогов: {conversations}\nВсего лидов: {leads}',
    admin_not_authorized: '❌ У вас нет доступа к панели администратора.',

    // Errors
    error_invalid_input: '❌ Неверный ввод. Пожалуйста, попробуйте снова.',
    error_general: '❌ Что-то пошло не так. Пожалуйста, попробуйте снова или обратитесь в поддержку.',

    // Misc
    month: 'месяц',
    quarter: 'квартал',
    year: 'год',
    sum: 'сум',
  },

  uz: {
    // Welcome & Language Selection
    welcome:
      '🎓 Oxbridge International School ga xush kelibsiz!\n\nIltimos, tilni tanlang:',
    language_selected: 'Til O\'zbekcha ga o\'rnatildi 🇺🇿',

    // Main Menu
    main_menu: '📋 Asosiy menyu\n\nSizga qanday yordam bera olaman?',
    btn_price_calculator: '💰 Narxni hisoblash',
    btn_connect_manager: '👤 Menejer bilan bog\'lanish',
    btn_faq: '❓ Ko\'p beriladigan savollar',
    btn_contact_info: '📞 Aloqa ma\'lumotlari',
    btn_change_language: '🌐 Tilni o\'zgartirish',
    btn_back: '⬅️ Orqaga',
    btn_main_menu: '🏠 Asosiy menyu',

    // Price Calculator
    calc_select_campus: '🏫 Iltimos, kampusni tanlang:',
    campus_mu: 'MU Kampus (Mirzo-Ulug\'bek)',
    campus_yash: 'Yashnobod Kampus',

    calc_select_program: '📚 Iltimos, dasturni tanlang:',
    program_ib: 'Xalqaro Bakalavr (IB)',
    program_rus: 'Rus maktabi',
    program_kg_rus: 'Rus bog\'chasi',
    program_kg_bi: 'Ikki tilli bog\'cha',

    calc_select_class: '🎒 Iltimos, sinf/darajani tanlang:',
    calc_enter_class_rus: 'Iltimos, sinf raqamini kiriting (1-11):',

    calc_number_of_children: '👨‍👩‍👧‍👦 2025-2026 da Oxbridge\'da nechta bola o\'qiydi?',
    btn_1_child: '1 bola',
    btn_2_children: '2 bola',
    btn_3_children: '3+ bola',

    calc_select_year: '📅 Qaysi o\'quv yilini qiziqtiryapsiz?',
    btn_year_2025_26: '2025-2026',
    btn_year_other: 'Boshqa yil',

    calc_select_payment_period: '💳 To\'lov davrini tanlang:',
    btn_monthly: 'Oylik',
    btn_quarterly: 'Choraklik',
    btn_annually: 'Yillik (chegirma bilan)',

    // Calculation Result
    calc_result_title: '📊 NARX HISOBI NATIJASI\n',
    calc_campus: 'Kampus: ',
    calc_program: 'Dastur: ',
    calc_class: 'Sinf: ',
    calc_year: 'Yil: ',
    calc_payment_period: 'To\'lov davri: ',
    calc_breakdown_title: '\n💵 Narx tafsiloti:\n',
    calc_child: 'Bola #',
    calc_base_price: 'Asosiy narx: ',
    calc_discount: 'Chegirma: ',
    calc_final_price: 'Yakuniy narx: ',
    calc_total: '\n💰 Jami ',
    calc_entry_fee: '\n🎫 Kirish to\'lovi: ',
    calc_discounts_applied: '\n🎁 Qo\'llanilgan chegirmalar:\n',
    calc_annual_savings: '\n✨ Yillik to\'lovda tejash: ',
    calc_per_month: '/oy',
    calc_per_quarter: '/chorak',
    calc_per_year: '/yil',

    // Connect to Manager
    connect_prompt:
      '👤 Ajoyib! Sizni shaxsiy menejer bilan bog\'lash uchun telefon raqamingizni ulashing:',
    btn_share_phone: '📱 Raqamni ulashish',
    connect_success:
      '✅ Rahmat! So\'rovingiz qabul bo\'limiga yuborildi. Menejer tez orada siz bilan bog\'lanadi!',
    connect_sent_to_crm: '📩 Botdan yangi lid',

    // FAQ
    faq_title: '❓ Ko\'p beriladigan savollar',
    faq_what_included: '📦 O\'qish narxiga nima kiradi?',
    faq_what_included_answer:
      'Narxga quyidagilar kiradi:\n• To\'liq o\'quv dasturi\n• O\'quv materiallari\n• Maktab imkoniyatlaridan foydalanish\n• Qo\'shimcha darslar\n• Kunlik ovqatlanish (nonushta, tushlik, atıştırmalıq)\n• Maktab transporti (ixtiyoriy, alohida to\'lov)',

    faq_what_we_offer: '🎓 Biz nima taklif qilamiz?',
    faq_what_we_offer_answer:
      'Oxbridge International School taklif qiladi:\n• IB World School dasturlari (PYP, MYP, DP)\n• Rus o\'quv dasturi (1-11 sinflar)\n• Ikki tilli ta\'lim\n• Zamonaviy jihozlar\n• Tajribali xalqaro o\'qituvchilar\n• Kichik sinflar\n• Har bir o\'quvchiga individual yondashuv',

    faq_admission_process: '📝 Qabul jarayoni qanday?',
    faq_admission_process_answer:
      'Qabul jarayoni:\n1. Ariza topshirish\n2. Kirish testi\n3. Ota-onalar va o\'quvchi bilan suhbat\n4. Qabul qarorini olish\n5. Hujjatlarni rasmiylashtirish',

    faq_schedule: '🕐 Maktab jadvali qanday?',
    faq_schedule_answer:
      'Ish vaqti:\n• Dushanba - Juma: 8:30 - 15:30\n• Qo\'shimcha mashg\'ulotlar: 17:00 gacha\n• To\'liq kun dasturi mavjud',

    btn_faq_included: '📦 Nima kiradi?',
    btn_faq_offer: '🎓 Bizning dasturlarimiz',
    btn_faq_admission: '📝 Qabul jarayoni',
    btn_faq_schedule: '🕐 Jadval',

    // Contact Info
    contact_title: '📞 ALOQA MA\'LUMOTLARI\n',
    contact_mu_campus: '🏫 MU Kampus (Mirzo-Ulug\'bek)',
    contact_mu_address: '📍 Manzil: Toshkent, Mirzo-Ulug\'bek tumani',
    contact_mu_phone: '📱 Telefon: +998 XX XXX XX XX',
    contact_yash_campus: '\n🏫 Yashnobod Kampus',
    contact_yash_address: '📍 Manzil: Toshkent, Yashnobod tumani',
    contact_yash_phone: '📱 Telefon: +998 XX XXX XX XX',
    contact_general: '\n📧 Umumiy savollar',
    contact_email: 'Email: info@oxbridge.uz',
    contact_website: '🌐 Veb-sayt: www.oxbridge.uz',
    contact_social: '\n📱 Ijtimoiy tarmoqlar',
    contact_instagram: 'Instagram: @oxbridge_school',
    contact_facebook: 'Facebook: OxbridgeSchool',

    // Admin Panel
    admin_panel: '⚙️ ADMINISTRATOR PANELI',
    btn_broadcast: '📢 Xabar yuborish',
    btn_view_stats: '📊 Statistika',
    btn_intercept_mode: '🎯 Ushlab olish rejimi',
    admin_broadcast_prompt: 'Barcha foydalanuvchilarga yuborish uchun xabar yozing:',
    admin_broadcast_confirm: 'Bu xabarni barcha foydalanuvchilarga yuborish?\n\nKo\'rib chiqish:\n',
    btn_confirm_send: '✅ Yuborishni tasdiqlash',
    btn_cancel: '❌ Bekor qilish',
    admin_broadcast_success: '✅ Xabar {count} foydalanuvchiga yuborildi',
    admin_intercept_on: '🎯 Ushlab olish rejimi: YONIQ\nSiz barcha foydalanuvchi xabarlarini olasiz.',
    admin_intercept_off: '🎯 Ushlab olish rejimi: O\'CHIQ',
    admin_stats: '📊 Statistika\n\nJami foydalanuvchilar: {users}\nJami suhbatlar: {conversations}\nJami lidlar: {leads}',
    admin_not_authorized: '❌ Administrator paneliga kirishga ruxsat yo\'q.',

    // Errors
    error_invalid_input: '❌ Noto\'g\'ri kiritish. Iltimos, qayta urinib ko\'ring.',
    error_general: '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring yoki qo\'llab-quvvatlashga murojaat qiling.',

    // Misc
    month: 'oy',
    quarter: 'chorak',
    year: 'yil',
    sum: 'so\'m',
  },

  tr: {
    // Welcome & Language Selection
    welcome:
      '🎓 Oxbridge International School\'a hoş geldiniz!\n\nLütfen dilinizi seçin:',
    language_selected: 'Dil Türkçe olarak ayarlandı 🇹🇷',

    // Main Menu
    main_menu: '📋 Ana Menü\n\nSize nasıl yardımcı olabilirim?',
    btn_price_calculator: '💰 Ücret Hesapla',
    btn_connect_manager: '👤 Müdür ile İletişim',
    btn_faq: '❓ Sık Sorulan Sorular',
    btn_contact_info: '📞 İletişim Bilgileri',
    btn_change_language: '🌐 Dili Değiştir',
    btn_back: '⬅️ Geri',
    btn_main_menu: '🏠 Ana Menü',

    // Price Calculator
    calc_select_campus: '🏫 Lütfen kampüs seçin:',
    campus_mu: 'MU Kampüsü (Mirzo-Ulugbek)',
    campus_yash: 'Yashnobod Kampüsü',

    calc_select_program: '📚 Lütfen program seçin:',
    program_ib: 'Uluslararası Bakalorya (IB)',
    program_rus: 'Rus Okulu',
    program_kg_rus: 'Rus Anaokulu',
    program_kg_bi: 'İki Dilli Anaokulu',

    calc_select_class: '🎒 Lütfen sınıf/seviye seçin:',
    calc_enter_class_rus: 'Lütfen sınıf numarasını girin (1-11):',

    calc_number_of_children: '👨‍👩‍👧‍👦 2025-2026\'da Oxbridge\'de kaç çocuk okuyacak?',
    btn_1_child: '1 çocuk',
    btn_2_children: '2 çocuk',
    btn_3_children: '3+ çocuk',

    calc_select_year: '📅 Hangi akademik yıl ilgileniyorsunuz?',
    btn_year_2025_26: '2025-2026',
    btn_year_other: 'Başka yıl',

    calc_select_payment_period: '💳 Ödeme dönemini seçin:',
    btn_monthly: 'Aylık',
    btn_quarterly: 'Üç Aylık',
    btn_annually: 'Yıllık (indirimli)',

    // Calculation Result
    calc_result_title: '📊 ÜCRET HESAPLAMA SONUCU\n',
    calc_campus: 'Kampüs: ',
    calc_program: 'Program: ',
    calc_class: 'Sınıf: ',
    calc_year: 'Yıl: ',
    calc_payment_period: 'Ödeme Dönemi: ',
    calc_breakdown_title: '\n💵 Fiyat Detayları:\n',
    calc_child: 'Çocuk #',
    calc_base_price: 'Temel fiyat: ',
    calc_discount: 'İndirim: ',
    calc_final_price: 'Son fiyat: ',
    calc_total: '\n💰 Toplam ',
    calc_entry_fee: '\n🎫 Giriş Ücreti: ',
    calc_discounts_applied: '\n🎁 Uygulanan İndirimler:\n',
    calc_annual_savings: '\n✨ Yıllık ödemede tasarruf: ',
    calc_per_month: '/ay',
    calc_per_quarter: '/çeyrek',
    calc_per_year: '/yıl',

    // Connect to Manager
    connect_prompt:
      '👤 Harika! Sizi kişisel müdür ile bağlamak için telefon numaranızı paylaşın:',
    btn_share_phone: '📱 Telefon Numarasını Paylaş',
    connect_success:
      '✅ Teşekkürler! İsteğiniz kabul ekibimize gönderildi. Bir müdür kısa süre içinde sizinle iletişime geçecek!',
    connect_sent_to_crm: '📩 Bottan yeni potansiyel müşteri',

    // FAQ
    faq_title: '❓ Sık Sorulan Sorular',
    faq_what_included: '📦 Öğrenim ücretine neler dahil?',
    faq_what_included_answer:
      'Ücrete dahil olanlar:\n• Tam akademik program\n• Öğrenim materyalleri\n• Okul tesislerine erişim\n• Ders dışı etkinlikler\n• Günlük yemekler (kahvaltı, öğle yemeği, atıştırmalıklar)\n• Okul servisi (isteğe bağlı, ayrı ücret)',

    faq_what_we_offer: '🎓 Ne sunuyoruz?',
    faq_what_we_offer_answer:
      'Oxbridge International School sunar:\n• IB World School programları (PYP, MYP, DP)\n• Rus müfredatı (1-11. sınıflar)\n• İki dilli eğitim\n• Modern tesisler\n• Deneyimli uluslararası öğretmenler\n• Küçük sınıflar\n• Her öğrenciye bireysel yaklaşım',

    faq_admission_process: '📝 Kabul süreci nedir?',
    faq_admission_process_answer:
      'Kabul süreci:\n1. Başvuru yapın\n2. Giriş değerlendirmesi\n3. Ebeveynler ve öğrenci ile görüşme\n4. Kabul kararını alın\n5. Kaydı tamamlayın',

    faq_schedule: '🕐 Okul programı nedir?',
    faq_schedule_answer:
      'Okul saatleri:\n• Pazartesi - Cuma: 8:30 - 15:30\n• Ders sonrası etkinlikler: 17:00\'a kadar\n• Tam gün programı mevcut',

    btn_faq_included: '📦 Neler dahil?',
    btn_faq_offer: '🎓 Programlarımız',
    btn_faq_admission: '📝 Kabul süreci',
    btn_faq_schedule: '🕐 Program',

    // Contact Info
    contact_title: '📞 İLETİŞİM BİLGİLERİ\n',
    contact_mu_campus: '🏫 MU Kampüsü (Mirzo-Ulugbek)',
    contact_mu_address: '📍 Adres: Taşkent, Mirzo-Ulugbek bölgesi',
    contact_mu_phone: '📱 Telefon: +998 XX XXX XX XX',
    contact_yash_campus: '\n🏫 Yashnobod Kampüsü',
    contact_yash_address: '📍 Adres: Taşkent, Yashnobod bölgesi',
    contact_yash_phone: '📱 Telefon: +998 XX XXX XX XX',
    contact_general: '\n📧 Genel Sorular',
    contact_email: 'E-posta: info@oxbridge.uz',
    contact_website: '🌐 Web sitesi: www.oxbridge.uz',
    contact_social: '\n📱 Sosyal Medya',
    contact_instagram: 'Instagram: @oxbridge_school',
    contact_facebook: 'Facebook: OxbridgeSchool',

    // Admin Panel
    admin_panel: '⚙️ YÖNETİCİ PANELİ',
    btn_broadcast: '📢 Toplu Mesaj',
    btn_view_stats: '📊 İstatistikleri Görüntüle',
    btn_intercept_mode: '🎯 Müdahale Modu',
    admin_broadcast_prompt: 'Tüm kullanıcılara göndermek istediğiniz mesajı yazın:',
    admin_broadcast_confirm: 'Bu mesajı tüm kullanıcılara gönder?\n\nÖnizleme:\n',
    btn_confirm_send: '✅ Göndermeyi Onayla',
    btn_cancel: '❌ İptal',
    admin_broadcast_success: '✅ Mesaj {count} kullanıcıya gönderildi',
    admin_intercept_on: '🎯 Müdahale modu: AÇIK\nTüm kullanıcı mesajlarını alacaksınız.',
    admin_intercept_off: '🎯 Müdahale modu: KAPALI',
    admin_stats: '📊 İstatistikler\n\nToplam kullanıcı: {users}\nToplam sohbet: {conversations}\nToplam potansiyel müşteri: {leads}',
    admin_not_authorized: '❌ Yönetici paneline erişim yetkiniz yok.',

    // Errors
    error_invalid_input: '❌ Geçersiz giriş. Lütfen tekrar deneyin.',
    error_general: '❌ Bir şeyler yanlış gitti. Lütfen tekrar deneyin veya destek ile iletişime geçin.',

    // Misc
    month: 'ay',
    quarter: 'çeyrek',
    year: 'yıl',
    sum: 'UZS',
  },
};

export function t(lang: Language, key: string, params?: Record<string, string>): string {
  let text = translations[lang]?.[key] || translations['en']?.[key] || key;

  // Replace placeholders like {count}, {users}, etc.
  if (params) {
    Object.keys(params).forEach((param) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
  }

  return text;
}
