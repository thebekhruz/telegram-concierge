// Telegram Web App
let tg = window.Telegram.WebApp;
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
const LANG_DISPLAY = {
    'en': 'EN',
    'uz': 'UZ',
    'ru': 'RU',
    'tr': 'TR'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyTelegramTheme();
    updateHeader();
    updateTranslations(); // Initial call to update translations
});

// Apply Telegram theme colors
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

// Header Management
function updateHeader() {
    const appHeader = document.getElementById('appHeader');
    const headerBackBtn = document.getElementById('headerBackBtn');
    const currentLangDisplay = document.getElementById('currentLangDisplay');
    const headerTitle = document.getElementById('headerTitle');

    const currentScreen = state.navigationHistory[state.navigationHistory.length - 1];

    // Hide header on welcome screen
    if (currentScreen === 'welcomeScreen') {
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
}

// Navigation Functions
function showScreen(screenId, addToHistory = true) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (addToHistory) {
        state.navigationHistory.push(screenId);
    }

    // Update campus image when showing dobScreen
    if (screenId === 'dobScreen' && state.campusPreference) {
        updateCampusImage();
    }

    updateHeader();
    window.scrollTo(0, 0);
}

function goBack() {
    if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop(); // Remove current screen
        const previousScreen = state.navigationHistory[state.navigationHistory.length - 1];
        showScreen(previousScreen, false);
    } else {
        // If at the first screen after welcome, go to menu
        if (state.navigationHistory[state.navigationHistory.length - 1] !== 'welcomeScreen') {
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

function goToMenu() {
    // Clear navigation to menu
    const welcomeIndex = state.navigationHistory.indexOf('welcomeScreen');
    if (welcomeIndex !== -1) {
        state.navigationHistory = state.navigationHistory.slice(0, welcomeIndex + 1);
    }
    showScreen('menuScreen');
}

function startCalculator() {
    showScreen('campusScreen');
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
}

function goToDobEntry() {
    goBack();
}

// Toggle collapsible sections
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.previousElementSibling;
    const icon = button.querySelector('.expand-icon');

    if (section.classList.contains('active')) {
        section.classList.remove('active');
        icon.textContent = '+';
    } else {
        // Close all other sections
        document.querySelectorAll('.collapsible-content').forEach(s => {
            s.classList.remove('active');
        });
        document.querySelectorAll('.expand-icon').forEach(i => {
            i.textContent = '+';
        });

        section.classList.add('active');
        icon.textContent = '−';
    }
}

// DOB Entry Management
function renderDobEntries() {
    const container = document.getElementById('childrenDobList');

    if (state.children.length === 0) {
        // Add first child by default
        state.children.push({ dob: '', age: null, options: [] });
    }

    container.innerHTML = state.children.map((child, index) => `
        <div class="dob-entry">
            <div class="dob-entry-header">
                <span class="dob-entry-title">Child ${index + 1}</span>
                ${index > 0 ? `<button class="remove-btn" onclick="removeChildDob(${index})">Remove</button>` : ''}
            </div>
            <input
                type="date"
                class="dob-input"
                id="dob-${index}"
                value="${child.dob}"
                onchange="updateChildDob(${index}, this.value)"
                max="2022-09-01"
                placeholder="Select date of birth"
            >
        </div>
    `).join('');
}

function addChildDob() {
    state.children.push({ dob: '', age: null, options: [] });
    renderDobEntries();
}

function removeChildDob(index) {
    state.children.splice(index, 1);
    renderDobEntries();
}

function updateChildDob(index, dob) {
    state.children[index].dob = dob;
}

// Age Calculation (as of September 1, 2025)
function calculateAge(dob) {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const cutoffDate = new Date('2025-09-01');

    let age = cutoffDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = cutoffDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && cutoffDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

// Determine available options based on age
function determineOptions(age, campusPreference) {
    const options = [];

    if (age === null || age < 0) return options;

    // Too young (under 3)
    if (age < 3) {
        return [{ tooYoung: true }];
    }

    const campuses = campusPreference === 'BOTH' ? ['MU', 'YASH'] : [campusPreference];

    campuses.forEach(campus => {
        // IB Programme options
        if (age >= 3 && age <= 4) {
            options.push({
                campus,
                programme: 'IB Kindergarten',
                programmeCode: 'IB',
                grade: 'KG',
                gradeCode: 'KG',
                price: getPrice(campus, 'IB', 'KG'),
                period: getPeriod(campus, 'IB', 'KG')
            });
        }

        if (age >= 5 && age <= 10) {
            const pypLevel = age - 4;  // 5yo → PYP1, 6yo → PYP2, etc.
            if (pypLevel >= 1 && pypLevel <= 5) {
                options.push({
                    campus,
                    programme: `IB Primary Years`,
                    programmeCode: 'IB',
                    grade: `PYP ${pypLevel}`,
                    gradeCode: `PYP${pypLevel}`,
                    price: getPrice(campus, 'IB', `PYP${pypLevel}`),
                    period: getPeriod(campus, 'IB', `PYP${pypLevel}`)
                });
            }
        }

        if (age >= 11 && age <= 15) {
            const mypLevel = age - 10;  // 11yo → MYP1, etc.
            if (mypLevel >= 1 && mypLevel <= 5) {
                options.push({
                    campus,
                    programme: `IB Middle Years`,
                    programmeCode: 'IB',
                    grade: `MYP ${mypLevel}`,
                    gradeCode: `MYP${mypLevel}`,
                    price: getPrice(campus, 'IB', `MYP${mypLevel}`),
                    period: getPeriod(campus, 'IB', `MYP${mypLevel}`)
                });
            }
        }

        if (age >= 16 && age <= 17) {
            const dpLevel = age - 15;  // 16yo → DP1, 17yo → DP2
            options.push({
                campus,
                programme: `IB Diploma Programme`,
                programmeCode: 'IB',
                grade: `DP ${dpLevel}`,
                gradeCode: `DP${dpLevel}`,
                price: getPrice(campus, 'IB', `DP${dpLevel}`),
                period: getPeriod(campus, 'IB', `DP${dpLevel}`)
            });
        }

        // Russian School Programme
        if (age >= 7 && age <= 17) {
            const russianGrade = age - 6;  // 7yo → Grade 1, etc.
            if (russianGrade >= 1 && russianGrade <= 11) {
                options.push({
                    campus,
                    programme: 'Russian School',
                    programmeCode: 'RUS',
                    grade: `Grade ${russianGrade}`,
                    gradeCode: `Grade${russianGrade}`,
                    price: getPrice(campus, 'RUS', russianGrade),
                    period: getPeriod(campus, 'RUS', russianGrade)
                });
            }
        }

        // Russian Kindergarten
        if (age >= 3 && age <= 6) {
            options.push({
                campus,
                programme: 'Russian Kindergarten',
                programmeCode: 'KG_RUS',
                grade: 'Kindergarten',
                gradeCode: 'KG',
                price: getPrice(campus, 'KG_RUS', 'KG'),
                period: getPeriod(campus, 'KG_RUS', 'KG')
            });
        }

        // Bilingual Kindergarten
        if (age >= 3 && age <= 6) {
            options.push({
                campus,
                programme: 'Bilingual Kindergarten',
                programmeCode: 'KG_BI',
                grade: 'Kindergarten',
                gradeCode: 'KG',
                price: getPrice(campus, 'KG_BI', 'KG'),
                period: getPeriod(campus, 'KG_BI', 'KG')
            });
        }
    });

    return options;
}

// Price lookup (approximate values for display)
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

    if (programmeCode === 'RUS') {
        return prices[campus]?.[programmeCode]?.[gradeCode] || 0;
    }

    return prices[campus]?.[programmeCode]?.[gradeCode] || 0;
}

function getPeriod(campus, programmeCode, gradeCode) {
    // IB and Kindergarten: quarterly, Russian School: monthly
    if (programmeCode === 'IB' || programmeCode === 'KG_RUS' || programmeCode === 'KG_BI') {
        return programmeCode === 'RUS' ? 'month' : 'quarter';
    }
    return 'month';
}

// Format price for display
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace(/,/g, ' ');
}

// Calculate Tuition
function calculateTuition() {
    // Validate all DOBs are filled
    const allFilled = state.children.every(child => child.dob);

    if (!allFilled) {
        tg.showAlert(t('val_enter_dob'));
        return;
    }

    // Calculate ages and determine options
    state.children.forEach(child => {
        child.age = calculateAge(child.dob);
        child.options = determineOptions(child.age, state.campusPreference);
    });

    displayResults();
    showScreen('resultsScreen');
}

// Display Results
function displayResults() {
    const container = document.getElementById('resultsContainer');
    const siblingNote = document.getElementById('siblingNote');

    // Show sibling note if multiple children
    if (state.children.length > 1) {
        siblingNote.style.display = 'block';
    } else {
        siblingNote.style.display = 'none';
    }

    container.innerHTML = state.children.map((child, index) => {
        const childNumber = index + 1;

        // Handle too young case
        if (child.options.length === 1 && child.options[0].tooYoung) {
            return `
                <div class="child-result-card">
                    <div class="child-result-header">
                        <span class="child-result-title">Child ${childNumber}</span>
                        <span class="child-result-age">Age: ${child.age} (as of Sept 1, 2025)</span>
                    </div>
                    <div class="waitlist-message">
                        <p>This child will be under 3 years old at the start of the 2025–2026 academic year.</p>
                        <p>We invite you to add them to our waitlist for future enrollment.</p>
                    </div>
                </div>
            `;
        }

        // Display options in grid
        const optionsHtml = child.options.map(option => `
            <div class="option-card">
                <div class="option-header">
                    <div class="option-programme">${option.programme}</div>
                    <div class="option-campus">${option.campus === 'MU' ? 'Mirzo-Ulugbek' : 'Yashnobod'}</div>
                </div>
                <div class="option-grade">${option.grade}</div>
                <div class="option-price">
                    <span class="price-label">from</span>
                    <span class="price-value">${formatPrice(option.price)}</span>
                    <span class="price-period">sum per ${option.period}</span>
                    <span class="price-note">(approx.)</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="child-result-card">
                <div class="child-result-header">
                    <span class="child-result-title">Child ${childNumber}</span>
                    <span class="child-result-age">Age: ${child.age} (as of Sept 1, 2025)</span>
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
        <p><strong>Note:</strong> Prices shown are approximate and based on 2025–2026 tuition rates. Your final offer will account for family discounts, payment plans, and any applicable promotions.</p>
        <p>Our Admissions team will prepare a personalized calculation for your family.</p>
    `;
    container.appendChild(disclaimer);
}

// Submit Request
async function submitRequest() {
    // Validate parent info
    const parentName = document.getElementById('parentName').value.trim();
    const parentPhone = document.getElementById('parentPhone').value.trim();
    const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value;
    const waitlist = document.getElementById('waitlistCheck').checked;

    if (!parentName) {
        tg.showAlert(t('val_enter_name'));
        return;
    }

    if (!parentPhone) {
        tg.showAlert(t('val_enter_phone'));
        return;
    }

    // Show loading
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

        // Send to backend
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
            // Show thank you screen
            document.getElementById('loadingOverlay').style.display = 'none';
            showScreen('thankYouScreen');
        } else {
            throw new Error(result.error || 'Failed to submit request');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingOverlay').style.display = 'none';
        tg.showAlert(t('val_error'));
    }
}

// Telegram back button
tg.BackButton.onClick(() => {
    tg.close();
});

// Show back button
tg.BackButton.show();
