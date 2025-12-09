/**
 * Oxbridge International School - Admissions Mini App
 * 
 * A Telegram Mini App for calculating tuition fees and submitting admission requests.
 * Supports multiple languages (EN, UZ, RU, TR) with dynamic translation loading.
 * 
 * @fileoverview Main application logic organized by screen/page sections
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/** Telegram Web App API instance */
const tg = window.Telegram.WebApp;
tg.expand();

// Application state
const state = {
    language: 'en',
    campusPreference: null,  // 'MU' | 'YASH' | 'BOTH'
    children: [],  // Array of { dob: string, age: number, options: [...] }
    navigationHistory: ['welcomeScreen']  // Track navigation for back button
};

// Translations
const translations = {
    en: {
        // Welcome
        welcomeTitle: 'Oxbridge International School',
        welcomeSubtitle: 'Admissions Assistant',
        welcomeText: 'Plan your child\'s education at our Mirzo-Ulugbek and Yashnobod campuses for 2025–2026.',
        welcomeInstruction: 'Choose your language to begin.',
        
        // Menu
        menuTitle: 'Admissions 2025–2026',
        tuitionCalculator: 'Tuition Calculator',
        tuitionCalculatorDesc: 'Calculate tuition for your children',
        whatIncluded: 'What is included in tuition',
        campusesLocation: 'Campuses & location',
        whatIsIB: 'What is IB?',
        
        // Campus Selection
        selectCampus: 'Select campus preference',
        muCampus: 'Mirzo-Ulugbek Campus',
        yashCampus: 'Yashnobod Campus',
        bothCampuses: 'Show both campuses',
        backToMenu: '← Back to menu',
        
        // DOB Screen
        childrenApplying: 'Children applying for 2025–2026',
        enterDob: 'Enter date of birth for each child',
        addChild: '+ Add another child',
        calculateTuition: 'Calculate tuition',
        back: '← Back',
        
        // Results
        availableOptions: 'Available options for 2025–2026',
        siblingNote: 'For your family enrolling multiple children in 2025–2026, tuition will be calculated with family discounts where applicable. Our admissions team will prepare a personalised offer.',
        requestCalculation: 'Request a detailed calculation and consultation',
        parentName: 'Parent name',
        phoneNumber: 'Phone number',
        preferredContact: 'Preferred contact method',
        telegram: 'Telegram',
        phoneCall: 'Phone call',
        waitlistCheck: 'Add younger child to waitlist for future years',
        submitRequest: 'Submit request to Admissions',
        modifyChildren: '← Modify children',
        
        // Thank You
        thankYou: 'Thank you',
        thankYouText1: 'Your request has been received by our Admissions team.',
        thankYouText2: 'They will contact you soon to provide a detailed calculation and answer your questions.',
        close: 'Close',
        
        // Header
        admissions: 'Admissions'
    },
    ru: {
        welcomeTitle: 'Oxbridge International School',
        welcomeSubtitle: 'Помощник по поступлению',
        welcomeText: 'Спланируйте образование вашего ребенка в наших кампусах Мирзо-Улугбек и Яшнабад на 2025–2026 год.',
        welcomeInstruction: 'Выберите язык для начала.',
        menuTitle: 'Поступление 2025–2026',
        tuitionCalculator: 'Калькулятор стоимости',
        tuitionCalculatorDesc: 'Рассчитайте стоимость обучения для ваших детей',
        whatIncluded: 'Что входит в стоимость обучения',
        campusesLocation: 'Кампусы и расположение',
        whatIsIB: 'Что такое IB?',
        selectCampus: 'Выберите предпочтение по кампусу',
        muCampus: 'Кампус Мирзо-Улугбек',
        yashCampus: 'Кампус Яшнабад',
        bothCampuses: 'Показать оба кампуса',
        backToMenu: '← Назад в меню',
        childrenApplying: 'Дети, поступающие в 2025–2026 году',
        enterDob: 'Введите дату рождения каждого ребенка',
        addChild: '+ Добавить еще одного ребенка',
        calculateTuition: 'Рассчитать стоимость',
        back: '← Назад',
        availableOptions: 'Доступные варианты на 2025–2026 год',
        siblingNote: 'Для вашей семьи, зачисляющей нескольких детей в 2025–2026 году, стоимость будет рассчитана с учетом семейных скидок, где применимо. Наша команда по приему подготовит персональное предложение.',
        requestCalculation: 'Запросить подробный расчет и консультацию',
        parentName: 'Имя родителя',
        phoneNumber: 'Номер телефона',
        preferredContact: 'Предпочтительный способ связи',
        telegram: 'Telegram',
        phoneCall: 'Телефонный звонок',
        waitlistCheck: 'Добавить младшего ребенка в список ожидания на будущие годы',
        submitRequest: 'Отправить запрос в приемную комиссию',
        modifyChildren: '← Изменить детей',
        thankYou: 'Спасибо',
        thankYouText1: 'Ваш запрос получен нашей приемной комиссией.',
        thankYouText2: 'Они свяжутся с вами в ближайшее время, чтобы предоставить подробный расчет и ответить на ваши вопросы.',
        close: 'Закрыть',
        admissions: 'Поступление'
    },
    uz: {
        welcomeTitle: 'Oxbridge International School',
        welcomeSubtitle: 'Qabul yordamchisi',
        welcomeText: '2025–2026 yil uchun Mirzo-Ulug\'bek va Yashnobod kampuslarimizda farzandingizning ta\'limini rejalashtiring.',
        welcomeInstruction: 'Boshlash uchun tilni tanlang.',
        menuTitle: 'Qabul 2025–2026',
        tuitionCalculator: 'Ta\'lim to\'lovi kalkulyatori',
        tuitionCalculatorDesc: 'Farzandlaringiz uchun ta\'lim to\'lovini hisoblang',
        whatIncluded: 'Ta\'lim to\'loviga nima kiradi',
        campusesLocation: 'Kampuslar va joylashuv',
        whatIsIB: 'IB nima?',
        selectCampus: 'Kampus afzalligini tanlang',
        muCampus: 'Mirzo-Ulug\'bek kampus',
        yashCampus: 'Yashnobod kampus',
        bothCampuses: 'Ikkala kampusni ko\'rsatish',
        backToMenu: '← Menyuga qaytish',
        childrenApplying: '2025–2026 yilga ariza berayotgan bolalar',
        enterDob: 'Har bir bolaning tug\'ilgan sanasini kiriting',
        addChild: '+ Yana bir bola qo\'shish',
        calculateTuition: 'Ta\'lim to\'lovini hisoblash',
        back: '← Orqaga',
        availableOptions: '2025–2026 yil uchun mavjud variantlar',
        siblingNote: '2025–2026 yilda bir nechta bolani ro\'yxatdan o\'tkazayotgan oilangiz uchun, qo\'llaniladigan joylarda oilaviy chegirmalar bilan ta\'lim to\'lovi hisoblanadi. Bizning qabul bo\'limimiz shaxsiy taklif tayyorlaydi.',
        requestCalculation: 'Batafsil hisob-kitob va maslahat so\'rash',
        parentName: 'Ota-ona ismi',
        phoneNumber: 'Telefon raqami',
        preferredContact: 'Afzal ko\'rilgan aloqa usuli',
        telegram: 'Telegram',
        phoneCall: 'Telefon qo\'ng\'irog\'i',
        waitlistCheck: 'Kichik bolani kelajak yillar uchun kutish ro\'yxatiga qo\'shish',
        submitRequest: 'Qabul bo\'limiga so\'rov yuborish',
        modifyChildren: '← Bolalarni o\'zgartirish',
        thankYou: 'Rahmat',
        thankYouText1: 'Sizning so\'rovingiz bizning qabul bo\'limimiz tomonidan qabul qilindi.',
        thankYouText2: 'Ular tez orada batafsil hisob-kitobni taqdim etish va savollaringizga javob berish uchun siz bilan bog\'lanishadi.',
        close: 'Yopish',
        admissions: 'Qabul'
    },
    tr: {
        welcomeTitle: 'Oxbridge International School',
        welcomeSubtitle: 'Kayıt Asistanı',
        welcomeText: '2025–2026 için Mirzo-Ulugbek ve Yashnobod kampüslerimizde çocuğunuzun eğitimini planlayın.',
        welcomeInstruction: 'Başlamak için dilinizi seçin.',
        menuTitle: 'Kayıt 2025–2026',
        tuitionCalculator: 'Öğrenim Ücreti Hesaplayıcı',
        tuitionCalculatorDesc: 'Çocuklarınız için öğrenim ücretini hesaplayın',
        whatIncluded: 'Öğrenim ücretine neler dahil',
        campusesLocation: 'Kampüsler ve konum',
        whatIsIB: 'IB nedir?',
        selectCampus: 'Kampüs tercihini seçin',
        muCampus: 'Mirzo-Ulugbek Kampüsü',
        yashCampus: 'Yashnobod Kampüsü',
        bothCampuses: 'Her iki kampüsü göster',
        backToMenu: '← Menüye dön',
        childrenApplying: '2025–2026 için başvuran çocuklar',
        enterDob: 'Her çocuk için doğum tarihini girin',
        addChild: '+ Başka bir çocuk ekle',
        calculateTuition: 'Öğrenim ücretini hesapla',
        back: '← Geri',
        availableOptions: '2025–2026 için mevcut seçenekler',
        siblingNote: '2025–2026\'da birden fazla çocuğu kaydeden aileniz için, öğrenim ücreti uygulanabilir yerlerde aile indirimleriyle hesaplanacaktır. Kayıt ekibimiz kişiselleştirilmiş bir teklif hazırlayacaktır.',
        requestCalculation: 'Detaylı hesaplama ve danışmanlık talep edin',
        parentName: 'Ebeveyn adı',
        phoneNumber: 'Telefon numarası',
        preferredContact: 'Tercih edilen iletişim yöntemi',
        telegram: 'Telegram',
        phoneCall: 'Telefon görüşmesi',
        waitlistCheck: 'Küçük çocuğu gelecek yıllar için bekleme listesine ekle',
        submitRequest: 'Kayıt ofisine istek gönder',
        modifyChildren: '← Çocukları değiştir',
        thankYou: 'Teşekkürler',
        thankYouText1: 'İsteğiniz Kayıt ekibimiz tarafından alındı.',
        thankYouText2: 'Yakında detaylı bir hesaplama sağlamak ve sorularınızı yanıtlamak için sizinle iletişime geçecekler.',
        close: 'Kapat',
        admissions: 'Kayıt'
    }
};

// Translation function
function t(key) {
    return translations[state.language]?.[key] || translations['en'][key] || key;
}

// Update all translations on the page
function updateTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Update specific elements by ID
    const updates = {
        'welcomeTitle': '.welcome-title',
        'welcomeSubtitle': '.welcome-subtitle',
        'welcomeText': '.welcome-text',
        'welcomeInstruction': '.welcome-instruction',
        'menuTitle': '#menuScreen .screen-title',
        'tuitionCalculator': '.menu-card-title',
        'selectCampus': '#campusScreen .screen-title',
        'childrenApplying': '#dobScreen .screen-title',
        'enterDob': '#dobScreen .screen-subtitle',
        'calculateTuition': '#dobScreen .primary-btn',
        'availableOptions': '#resultsScreen .screen-title',
        'requestCalculation': '.submit-title',
        'parentName': 'label[for="parentName"], label:has(+ #parentName)',
        'phoneNumber': 'label[for="parentPhone"], label:has(+ #parentPhone)',
        'preferredContact': 'label:has(+ .radio-options)',
        'submitRequest': '#resultsScreen .primary-btn',
        'thankYou': '.thank-you-title',
        'thankYouText1': '.thank-you-text:first-of-type',
        'thankYouText2': '.thank-you-text:last-of-type',
        'close': '.secondary-btn'
    };
    
    // Manual updates for complex elements
    if (document.querySelector('#menuScreen .menu-card-title')) {
        document.querySelector('#menuScreen .menu-card.primary .menu-card-title').textContent = t('tuitionCalculator');
        document.querySelector('#menuScreen .menu-card.primary .menu-card-desc').textContent = t('tuitionCalculatorDesc');
    }
    
    if (document.querySelector('#campusScreen .campus-option-title')) {
        const campusOptions = document.querySelectorAll('#campusScreen .campus-option-title');
        if (campusOptions[0]) campusOptions[0].textContent = t('muCampus');
        if (campusOptions[1]) campusOptions[1].textContent = t('yashCampus');
        if (campusOptions[2]) campusOptions[2].textContent = t('bothCampuses');
    }
    
    // Update header title
    updateHeader();
}

// Language display mapping
/** Language code to display name mapping */
const LANG_DISPLAY = {
    'en': 'EN',
    'uz': 'UZ',
    'ru': 'RU',
    'tr': 'TR'
};

/** Screen IDs used throughout the application */
const SCREENS = {
    WELCOME: 'welcomeScreen',
    MENU: 'menuScreen',
    CAMPUS: 'campusScreen',
    DOB: 'dobScreen',
    RESULTS: 'resultsScreen',
    THANK_YOU: 'thankYouScreen'
};

/** Campus codes */
const CAMPUS = {
    MU: 'MU',
    YASH: 'YASH',
    BOTH: 'BOTH'
};

/** Academic year cutoff date for age calculation */
const CUTOFF_DATE = '2025-09-01';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Application state object
 * @typedef {Object} AppState
 * @property {string} language - Current language code (en, uz, ru, tr)
 * @property {string|null} campusPreference - Selected campus preference (MU, YASH, BOTH)
 * @property {Array<ChildData>} children - Array of child data objects
 * @property {Array<string>} navigationHistory - Stack of visited screens for back navigation
 */

/**
 * Child data structure
 * @typedef {Object} ChildData
 * @property {string} dob - Date of birth (YYYY-MM-DD format)
 * @property {number|null} age - Calculated age as of cutoff date
 * @property {Array<OptionData>} options - Available programme options for this child
 */

/**
 * Programme option data structure
 * @typedef {Object} OptionData
 * @property {string} campus - Campus code (MU or YASH)
 * @property {string} programme - Programme name (translated)
 * @property {string} programmeCode - Programme code (IB, RUS, KG_RUS, KG_BI)
 * @property {string} grade - Grade/level name
 * @property {string} gradeCode - Grade code
 * @property {number} price - Tuition price in UZS
 * @property {string} period - Payment period (month or quarter)
 */

/** Global application state */
const state = {
    language: 'en',
    campusPreference: null,
    children: [],
    navigationHistory: [SCREENS.WELCOME]
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the application when DOM is ready
 * Sets up theme, loads default translations, and updates UI
 */
document.addEventListener('DOMContentLoaded', async () => {
    applyTelegramTheme();
    // Load default English translations for welcome screen
    await window.translations.load('en');
    updateHeader();
    updateTranslations(); // Initial call to update translations
    updateWelcomeScreen();
});

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

/**
 * Apply Telegram theme colors to the application
 * Adapts to dark/light mode and uses Telegram's theme parameters
 */
function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty('--bg-main', tg.themeParams.bg_color);
    }

    if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty('--text-primary', tg.themeParams.text_color);
    }

    if (tg.themeParams.button_color) {
        document.documentElement.style.setProperty('--primary', tg.themeParams.button_color);
    }
}

// ============================================================================
// HEADER MANAGEMENT
// ============================================================================

/**
 * Update the app header based on current screen and navigation state
 * Handles visibility, back button, language display, and title
 */
function updateHeader() {
    const appHeader = document.getElementById('appHeader');
    const headerBackBtn = document.getElementById('headerBackBtn');
    const currentLangDisplay = document.getElementById('currentLangDisplay');
    const headerTitle = document.getElementById('headerTitle');

    const currentScreen = state.navigationHistory[state.navigationHistory.length - 1];

    // Hide header on welcome screen
    if (currentScreen === SCREENS.WELCOME) {
        appHeader.style.display = 'none';
        return;
    }

    // Show header on all other screens
    appHeader.style.display = 'flex';

    // Show/hide back button based on navigation history
    if (state.navigationHistory.length > 1) {
        headerBackBtn.style.display = 'block';
    } else {
        headerBackBtn.style.display = 'none';
    }

    // Update language display
    currentLangDisplay.textContent = LANG_DISPLAY[state.language] || 'EN';

    // Update title based on screen (using translations)
    const titles = {
        'menuScreen': t('menu_title'),
        'campusScreen': t('campus_screen_title'),
        'dobScreen': t('dob_screen_title'),
        'resultsScreen': t('results_screen_title'),
        'thankYouScreen': t('thank_you_title')
    };
    headerTitle.textContent = titles[currentScreen] || t('menu_title');
    // Update title based on screen
    const titleKeys = {
        [SCREENS.MENU]: 'header.admissions',
        [SCREENS.CAMPUS]: 'header.chooseCampus',
        [SCREENS.DOB]: 'header.enterDatesOfBirth',
        [SCREENS.RESULTS]: 'header.calculationResults',
        [SCREENS.THANK_YOU]: 'header.thankYou'
    };
    const titleKey = titleKeys[currentScreen] || 'header.admissions';
    headerTitle.textContent = window.translations.t(titleKey);
}

// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================

/**
 * Show a specific screen and update navigation history
 * @param {string} screenId - ID of the screen to show
 * @param {boolean} addToHistory - Whether to add this screen to navigation history
 */
function showScreen(screenId, addToHistory = true) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');

    // Update navigation history
    if (addToHistory) {
        state.navigationHistory.push(screenId);
    }

    // Update campus image when showing dobScreen
    if (screenId === 'dobScreen' && state.campusPreference) {
        updateCampusImage();
    }

    updateHeader();
    
    // Update translations when screen changes
    if (window.translations && window.translations.update) {
        window.translations.update();
    }
    
    window.scrollTo(0, 0);
}

/**
 * Navigate back to previous screen
 * Handles edge cases like going back from first screen after welcome
 */
function goBack() {
    if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop(); // Remove current screen
        const previousScreen = state.navigationHistory[state.navigationHistory.length - 1];
        showScreen(previousScreen, false);
    } else {
        // If at the first screen after welcome, go to menu
        if (state.navigationHistory[state.navigationHistory.length - 1] !== SCREENS.WELCOME) {
            goToMenu();
        }
    }
}

function showLanguageSelection() {
    // Clear history and go to welcome screen
    state.navigationHistory = ['welcomeScreen'];
    showScreen('welcomeScreen', false);
}

function selectLanguage(lang) {
    state.language = lang;
    updateAllText(); // Update all text to new language
    state.navigationHistory = ['welcomeScreen'];
    updateTranslations();
    showScreen('menuScreen');
}

// Update all text on the page based on current language
function updateAllText() {
    // Helper function to safely update text
    const updateText = (selector, key) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = t(key);
    };

    const updatePlaceholder = (selector, key) => {
        const element = document.querySelector(selector);
        if (element) element.placeholder = t(key);
    };

    // Update header titles based on current screen
    updateHeader();

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.type !== 'radio' && el.type !== 'checkbox') {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
}

/**
 * Navigate to menu screen
 * Clears navigation history back to welcome screen
 */
function goToMenu() {
    const welcomeIndex = state.navigationHistory.indexOf(SCREENS.WELCOME);
    if (welcomeIndex !== -1) {
        state.navigationHistory = state.navigationHistory.slice(0, welcomeIndex + 1);
    }
    showScreen(SCREENS.MENU);
}

// ============================================================================
// WELCOME SCREEN
// ============================================================================

/**
 * Update welcome screen with current translations
 * Called on initialization and when language changes
 */
function updateWelcomeScreen() {
    const t = window.translations.t;
    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    const welcomeText = document.querySelector('.welcome-text');
    const welcomeInstruction = document.querySelector('.welcome-instruction');
    
    if (welcomeTitle) welcomeTitle.textContent = t('welcome.title');
    if (welcomeSubtitle) welcomeSubtitle.textContent = t('welcome.subtitle');
    if (welcomeText) welcomeText.textContent = t('welcome.description');
    if (welcomeInstruction) welcomeInstruction.textContent = t('welcome.instruction');
}

function selectCampus(campus) {
    state.campusPreference = campus;
    state.children = [];
    updateCampusImage();
    renderDobEntries();
    showScreen('dobScreen');
}

function updateCampusImage() {
    const campusImage = document.getElementById('campusImage');
    if (!campusImage) return;

    let imageSrc = '';
    switch (state.campusPreference) {
        case 'MU':
            imageSrc = '/images/campus-mu.jpg';
            break;
        case 'YASH':
            imageSrc = '/images/campus-yash.jpg';
            break;
        case 'BOTH':
            imageSrc = '/images/both-campuses.jpg';
            break;
        default:
            campusImage.style.display = 'none';
            return;
    }

    campusImage.src = imageSrc;
    campusImage.style.display = 'block';
    campusImage.onerror = function() {
        this.style.display = 'none';
    };
}

function goToCampusSelection() {
    goBack();
/**
 * Show language selection screen
 * Resets navigation history and returns to welcome screen
 */
function showLanguageSelection() {
    state.navigationHistory = [SCREENS.WELCOME];
    showScreen(SCREENS.WELCOME, false);
}

/**
 * Select a language and navigate to menu
 * Loads translations for the selected language and updates UI
 * @param {string} lang - Language code to select (en, uz, ru, tr)
 */
async function selectLanguage(lang) {
    state.language = lang;
    // Load translations for selected language
    await window.translations.load(lang);
    state.navigationHistory = [SCREENS.WELCOME];
    // Update all translations in the UI
    window.translations.update();
    updateWelcomeScreen();
    showScreen(SCREENS.MENU);
}

// ============================================================================
// MENU SCREEN
// ============================================================================

/**
 * Start the tuition calculator flow
 * Navigates to campus selection screen
 */
function startCalculator() {
    showScreen(SCREENS.CAMPUS);
}

/**
 * Toggle collapsible section in menu
 * Closes other sections when opening a new one
 * @param {string} sectionId - ID of the section to toggle
 */
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.previousElementSibling;
    const icon = button.querySelector('.expand-icon');

    if (section.classList.contains('active')) {
        // Close section
        section.classList.remove('active');
        icon.textContent = '+';
    } else {
        // Close all other sections first
        document.querySelectorAll('.collapsible-content').forEach(s => {
            s.classList.remove('active');
        });
        document.querySelectorAll('.expand-icon').forEach(i => {
            i.textContent = '+';
        });

        // Open selected section
        section.classList.add('active');
        icon.textContent = '−';
    }
}

/**
 * Toggle FAQ item open/closed
 * Closes other FAQ items in the same container when opening a new one
 * @param {HTMLElement} button - The FAQ question button element
 */
function toggleFaqItem(button) {
    const faqItem = button.closest('.faq-item, .faq-card');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items in the same container
    const container = faqItem.parentElement;
    container.querySelectorAll('.faq-item, .faq-card').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ============================================================================
// CAMPUS SELECTION SCREEN
// ============================================================================

/**
 * Select a campus preference and proceed to DOB entry
 * Resets children data and renders DOB entry form
 * @param {string} campus - Campus code (MU, YASH, or BOTH)
 */
function selectCampus(campus) {
    state.campusPreference = campus;
    state.children = [];
    renderDobEntries();
    showScreen(SCREENS.DOB);
}

/**
 * Navigate back to campus selection screen
 */
function goToCampusSelection() {
    goBack();
}

// ============================================================================
// DOB ENTRY SCREEN
// ============================================================================

/**
 * Render date of birth entry form for all children
 * Creates input fields for each child with remove buttons (except first)
 */
function renderDobEntries() {
    const container = document.getElementById('childrenDobList');

    // Add first child by default if none exist
    if (state.children.length === 0) {
        state.children.push({ dob: '', age: null, options: [] });
    }

    const t = window.translations.t;
    container.innerHTML = state.children.map((child, index) => `
        <div class="dob-entry">
            <div class="dob-entry-header">
                <span class="dob-entry-title">${t('dob.child')} ${index + 1}</span>
                ${index > 0 ? `<button class="remove-btn" onclick="removeChildDob(${index})">${t('dob.remove') || 'Remove'}</button>` : ''}
            </div>
            <input
                type="date"
                class="dob-input"
                id="dob-${index}"
                value="${child.dob}"
                onchange="updateChildDob(${index}, this.value)"
                max="2022-09-01"
                placeholder="${t('dob.selectDate') || 'Select date of birth'}"
            >
        </div>
    `).join('');
}

/**
 * Add a new child DOB entry
 */
function addChildDob() {
    state.children.push({ dob: '', age: null, options: [] });
    renderDobEntries();
}

/**
 * Remove a child DOB entry
 * @param {number} index - Index of the child to remove
 */
function removeChildDob(index) {
    state.children.splice(index, 1);
    renderDobEntries();
}

/**
 * Update date of birth for a specific child
 * @param {number} index - Index of the child
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 */
function updateChildDob(index, dob) {
    state.children[index].dob = dob;
}

/**
 * Navigate back to DOB entry screen
 */
function goToDobEntry() {
    goBack();
}

/**
 * Calculate tuition based on entered DOBs
 * Validates input, calculates ages, determines options, and displays results
 */
function calculateTuition() {
    // Validate all DOBs are filled
    const allFilled = state.children.every(child => child.dob);

    if (!allFilled) {
        tg.showAlert(t('val_enter_dob'));
        const t = window.translations.t;
        tg.showAlert(t('dob.enterAll') || 'Please enter date of birth for all children');
        return;
    }

    // Calculate ages and determine options for each child
    state.children.forEach(child => {
        child.age = calculateAge(child.dob);
        child.options = determineOptions(child.age, state.campusPreference);
    });

    displayResults();
    showScreen(SCREENS.RESULTS);
}

// ============================================================================
// RESULTS SCREEN
// ============================================================================

/**
 * Display calculation results for all children
 * Shows available programme options, prices, and handles edge cases (too young)
 */
function displayResults() {
    const container = document.getElementById('resultsContainer');
    const siblingNote = document.getElementById('siblingNote');
    const t = window.translations.t;

    // Show sibling note if multiple children
    if (state.children.length > 1) {
        siblingNote.style.display = 'block';
    } else {
        siblingNote.style.display = 'none';
    }

    // Generate HTML for each child's results
    container.innerHTML = state.children.map((child, index) => {
        const childNumber = index + 1;

        // Handle too young case (under 3 years old)
        if (child.options.length === 1 && child.options[0].tooYoung) {
            return `
                <div class="child-result-card">
                    <div class="child-result-header">
                        <span class="child-result-title">${t('dob.child')} ${childNumber}</span>
                        <span class="child-result-age">${t('results.ageAsOf', { age: child.age })}</span>
                    </div>
                    <div class="waitlist-message">
                        <p>${t('results.tooYoung')}</p>
                        <p>${t('results.waitlistInvite')}</p>
                    </div>
                </div>
            `;
        }

        // Display available options in grid
        const optionsHtml = child.options.map(option => {
            const campusName = getCampusDisplayName(option.campus);
            const period = getTranslatedPeriod(option.period);
            return `
                <div class="option-card">
                    <div class="option-header">
                        <div class="option-programme">${option.programme}</div>
                        <div class="option-campus">${campusName}</div>
                    </div>
                    <div class="option-grade">${option.grade}</div>
                    <div class="option-price">
                        <span class="price-label">${t('results.from')}</span>
                        <span class="price-value">${formatPrice(option.price)}</span>
                        <span class="price-period">${t('results.sumPer', { period })}</span>
                        <span class="price-note">${t('results.approx')}</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="child-result-card">
                <div class="child-result-header">
                    <span class="child-result-title">${t('dob.child')} ${childNumber}</span>
                    <span class="child-result-age">${t('results.ageAsOf', { age: child.age })}</span>
                </div>
                <div class="options-grid">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');

    // Add disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'price-disclaimer';
    disclaimer.innerHTML = `
        <p><strong>${t('results.disclaimerNote') || 'Note:'}</strong> ${t('results.disclaimer')}</p>
        <p>${t('results.disclaimer2')}</p>
    `;
    container.appendChild(disclaimer);
}

// ============================================================================
// SUBMIT & THANK YOU SCREEN
// ============================================================================

/**
 * Submit admission request to backend
 * Validates form data, sends to API, and handles response
 */
async function submitRequest() {
    // Get form values
    const parentName = document.getElementById('parentName').value.trim();
    const parentPhone = document.getElementById('parentPhone').value.trim();
    const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value;
    const waitlist = document.getElementById('waitlistCheck').checked;

    const t = window.translations.t;
    
    // Validate required fields
    if (!parentName) {
        tg.showAlert(t('val_enter_name'));
        tg.showAlert(t('submit.enterName') || 'Please enter your full name');
        return;
    }

    if (!parentPhone) {
        tg.showAlert(t('val_enter_phone'));
        tg.showAlert(t('submit.enterPhone') || 'Please enter your phone number');
        return;
    }

    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        // Prepare submission data
        const applicationData = {
            parent: {
                name: parentName,
                phone: parentPhone
            },
            contactMethod: contactMethod,
            waitlist: waitlist,
            campusPreference: state.campusPreference,
            preferredLanguage: state.language,
            startDate: '2025-2026',
            children: state.children.map((child, index) => ({
                childNumber: index + 1,
                dob: child.dob,
                age: child.age,
                options: child.options
            }))
        };

        // Send to backend API
        const response = await fetch('/api/submit-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicationData,
                telegramUser: tg.initDataUnsafe?.user || {}
            })
        });

        const result = await response.json();

        if (result.success) {
            // Hide loading and show thank you screen
            document.getElementById('loadingOverlay').style.display = 'none';
            showScreen(SCREENS.THANK_YOU);
        } else {
            throw new Error(result.error || 'Failed to submit request');
        }
    } catch (error) {
        console.error('Error submitting request:', error);
        document.getElementById('loadingOverlay').style.display = 'none';
        tg.showAlert(t('val_error'));
    }
}

// ============================================================================
// UTILITY FUNCTIONS - PRICING
// ============================================================================

/**
 * Get tuition price for a specific campus, programme, and grade
 * Prices are approximate for 2025-2026 academic year in UZS
 * @param {string} campus - Campus code (MU or YASH)
 * @param {string} programmeCode - Programme code (IB, RUS, KG_RUS, KG_BI)
 * @param {string|number} gradeCode - Grade code (KG, PYP1-5, MYP1-5, DP1-2, or 1-11 for Russian)
 * @returns {number} Price in UZS, or 0 if not found
 */
function getPrice(campus, programmeCode, gradeCode) {
    // Approximate 2025-2026 prices (in sum)
    const prices = {
        MU: {
            IB: {
                KG: 28875000,
                PYP1: 43257500, PYP2: 43257500, PYP3: 43257500, PYP4: 43257500, PYP5: 43257500,
                MYP1: 51975000, MYP2: 51975000, MYP3: 51975000, MYP4: 51975000, MYP5: 51975000,
                DP1: 60692500, DP2: 60692500
            },
            RUS: {
                1: 9460000, 2: 9460000, 3: 9460000, 4: 9460000,
                5: 10340000, 6: 10340000, 7: 10340000, 8: 10340000,
                9: 11220000, 10: 11220000, 11: 11220000
            },
            KG_RUS: { KG: 6600000 },
            KG_BI: { KG: 8800000 }
        },
        YASH: {
            IB: {
                KG: 34650000,
                PYP1: 51909000, PYP2: 51909000, PYP3: 51909000, PYP4: 51909000, PYP5: 51909000,
                MYP1: 62370000, MYP2: 62370000, MYP3: 62370000, MYP4: 62370000, MYP5: 62370000,
                DP1: 72831000, DP2: 72831000
            },
            RUS: {
                1: 11352000, 2: 11352000, 3: 11352000, 4: 11352000,
                5: 12408000, 6: 12408000, 7: 12408000, 8: 12408000,
                9: 13464000, 10: 13464000, 11: 13464000
            },
            KG_RUS: { KG: 7920000 },
            KG_BI: { KG: 10560000 }
        }
    };

    return prices[campus]?.[programmeCode]?.[gradeCode] || 0;
}

/**
 * Get payment period for a programme
 * IB and Kindergarten programmes use quarterly payments, Russian School uses monthly
 * @param {string} campus - Campus code (not used but kept for consistency)
 * @param {string} programmeCode - Programme code
 * @param {string} gradeCode - Grade code (not used but kept for consistency)
 * @returns {string} Payment period ('month' or 'quarter')
 */
function getPeriod(campus, programmeCode, gradeCode) {
    // IB and Kindergarten: quarterly, Russian School: monthly
    if (programmeCode === 'IB' || programmeCode === 'KG_RUS' || programmeCode === 'KG_BI') {
        return programmeCode === 'RUS' ? 'month' : 'quarter';
    }
    return 'month';
}

/**
 * Get translated period name
 * @param {string} period - Period code ('month' or 'quarter')
 * @returns {string} Translated period name
 */
function getTranslatedPeriod(period) {
    const t = window.translations.t;
    return t(`periods.${period}`) || period;
}

/**
 * Format price for display with thousand separators
 * @param {number} price - Price in UZS
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace(/,/g, ' ');
}

/**
 * Get display name for campus
 * @param {string} campus - Campus code (MU or YASH)
 * @returns {string} Campus display name (translated, without "Campus" suffix)
 */
function getCampusDisplayName(campus) {
    const t = window.translations.t;
    const fullName = campus === CAMPUS.MU 
        ? t('campus.muCampus')
        : t('campus.yashCampus');
    // Remove common suffixes in different languages
    return fullName.replace(' Campus', '').replace(' Kampus', '').replace(' Kampüsü', '');
}

// ============================================================================
// TELEGRAM INTEGRATION
// ============================================================================

/**
 * Setup Telegram back button handler
 * Closes the mini app when back button is pressed
 */
tg.BackButton.onClick(() => {
    tg.close();
});

// Show Telegram back button
tg.BackButton.show();
