// ============================================================================
// TELEGRAM WEB APP INITIALIZATION
// ============================================================================

const tg = window.Telegram?.WebApp || {
    expand: () => {},
    BackButton: { onClick: () => {}, show: () => {}, hide: () => {} },
    initDataUnsafe: {},
    showAlert: (msg) => alert(msg),
    close: () => {},
    colorScheme: 'light'
};

tg.expand();

// ============================================================================
// APPLICATION STATE
// ============================================================================

const state = {
    language: 'en',
    campusPreference: null,
    children: [],
    navigationHistory: ['welcomeScreen']
};

const LANG_DISPLAY = {
    'en': 'EN',
    'uz': 'UZ',
    'ru': 'RU',
    'tr': 'TR'
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    applyTelegramTheme();
    updateHeader();
});

function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// ============================================================================
// HEADER MANAGEMENT
// ============================================================================

function updateHeader() {
    const appHeader = document.getElementById('appHeader');
    const headerBackBtn = document.getElementById('headerBackBtn');
    const currentLangDisplay = document.getElementById('currentLangDisplay');
    const headerTitle = document.getElementById('headerTitle');
    const currentScreen = state.navigationHistory[state.navigationHistory.length - 1];

    if (currentScreen === 'welcomeScreen') {
        appHeader.classList.add('hidden');
        return;
    }

    appHeader.classList.remove('hidden');

    // Show/hide back button
    headerBackBtn.style.display = state.navigationHistory.length > 1 ? 'block' : 'none';

    // Update language display
    currentLangDisplay.textContent = LANG_DISPLAY[state.language] || 'EN';

    // Update title
    const titles = {
        'menuScreen': t('menu_title') || 'Admissions 2025–2026',
        'campusScreen': t('campus_screen_title') || 'Select Campus',
        'dobScreen': t('dob_screen_title') || 'Children Applying',
        'resultsScreen': t('results_screen_title') || 'Available Options',
        'thankYouScreen': t('thank_you_title') || 'Thank You'
    };

    headerTitle.textContent = titles[currentScreen] || 'Admissions';
}

// ============================================================================
// NAVIGATION
// ============================================================================

function showScreen(screenId, addToHistory = true) {
    const allScreens = document.querySelectorAll('.screen');
    const targetScreen = document.getElementById(screenId);

    allScreens.forEach(screen => screen.classList.remove('active'));
    targetScreen.classList.add('active');

    if (addToHistory) {
        state.navigationHistory.push(screenId);
    }

    // Update campus image if on DOB screen
    if (screenId === 'dobScreen' && state.campusPreference) {
        updateCampusImage();
    }

    updateHeader();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop();
        const previousScreen = state.navigationHistory[state.navigationHistory.length - 1];
        showScreen(previousScreen, false);
    }
}

function showLanguageSelection() {
    state.navigationHistory = ['welcomeScreen'];
    showScreen('welcomeScreen', false);
}

// ============================================================================
// LANGUAGE MANAGEMENT
// ============================================================================

function selectLanguage(lang) {
    state.language = lang;
    updateAllText();
    state.navigationHistory = ['welcomeScreen'];
    showScreen('menuScreen');
}

function updateAllText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = t(key);

        if (el.tagName === 'INPUT' && el.type !== 'radio' && el.type !== 'checkbox') {
            el.placeholder = translation;
        } else {
            el.textContent = translation;
        }
    });

    updateHeader();
}

// ============================================================================
// CALCULATOR FLOW
// ============================================================================

function startCalculator() {
    showScreen('campusScreen');
}

function selectCampus(campus) {
    state.campusPreference = campus;
    state.children = [];
    renderDobEntries();
    showScreen('dobScreen');
}

function updateCampusImage() {
    const campusImage = document.getElementById('campusImage');
    if (!campusImage) return;

    const imageSources = {
        'MU': '/images/campus-mu.jpg',
        'YASH': '/images/campus-yash.jpg',
        'BOTH': '/images/both-campuses.jpg'
    };

    const imageSrc = imageSources[state.campusPreference];

    if (imageSrc) {
        campusImage.src = imageSrc;
        campusImage.style.display = 'block';
        campusImage.onerror = () => campusImage.style.display = 'none';
    } else {
        campusImage.style.display = 'none';
    }
}

// ============================================================================
// DOB ENTRY MANAGEMENT
// ============================================================================

function renderDobEntries() {
    const container = document.getElementById('childrenDobList');

    if (state.children.length === 0) {
        state.children.push({ dob: '', age: null, options: [] });
    }

    container.innerHTML = state.children.map((child, index) => `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200">
            <div class="flex items-center justify-between mb-3">
                <span class="font-semibold text-gray-900">${t('child_number')} ${index + 1}</span>
                ${index > 0 ? `<button onclick="removeChildDob(${index})" class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">${t('remove_child')}</button>` : ''}
            </div>
            <input
                type="date"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                id="dob-${index}"
                value="${child.dob}"
                onchange="updateChildDob(${index}, this.value)"
                max="2022-09-01"
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

// ============================================================================
// AGE CALCULATION & OPTIONS
// ============================================================================

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

function determineOptions(age, campusPreference) {
    const options = [];

    if (age === null || age < 0) return options;
    if (age < 3) return [{ tooYoung: true }];

    const campuses = campusPreference === 'BOTH' ? ['MU', 'YASH'] : [campusPreference];

    campuses.forEach(campus => {
        // IB Kindergarten (ages 3-4)
        if (age >= 3 && age <= 4) {
            options.push({
                campus,
                programme: t('prog_ib_kg'),
                programmeCode: 'IB',
                grade: 'KG',
                gradeCode: 'KG',
                price: getPrice(campus, 'IB', 'KG'),
                period: 'quarter'
            });
        }

        // IB Primary Years (ages 5-10)
        if (age >= 5 && age <= 10) {
            const pypLevel = age - 4;
            if (pypLevel >= 1 && pypLevel <= 5) {
                options.push({
                    campus,
                    programme: t('prog_ib_pyp'),
                    programmeCode: 'IB',
                    grade: `PYP ${pypLevel}`,
                    gradeCode: `PYP${pypLevel}`,
                    price: getPrice(campus, 'IB', `PYP${pypLevel}`),
                    period: 'quarter'
                });
            }
        }

        // IB Middle Years (ages 11-15)
        if (age >= 11 && age <= 15) {
            const mypLevel = age - 10;
            if (mypLevel >= 1 && mypLevel <= 5) {
                options.push({
                    campus,
                    programme: t('prog_ib_myp'),
                    programmeCode: 'IB',
                    grade: `MYP ${mypLevel}`,
                    gradeCode: `MYP${mypLevel}`,
                    price: getPrice(campus, 'IB', `MYP${mypLevel}`),
                    period: 'quarter'
                });
            }
        }

        // IB Diploma (ages 16-17)
        if (age >= 16 && age <= 17) {
            const dpLevel = age - 15;
            options.push({
                campus,
                programme: t('prog_ib_dp'),
                programmeCode: 'IB',
                grade: `DP ${dpLevel}`,
                gradeCode: `DP${dpLevel}`,
                price: getPrice(campus, 'IB', `DP${dpLevel}`),
                period: 'quarter'
            });
        }

        // Russian School Programme (ages 7-17)
        if (age >= 7 && age <= 17) {
            const russianGrade = age - 6;
            if (russianGrade >= 1 && russianGrade <= 11) {
                options.push({
                    campus,
                    programme: t('prog_rus'),
                    programmeCode: 'RUS',
                    grade: `${t('grade')} ${russianGrade}`,
                    gradeCode: russianGrade,
                    price: getPrice(campus, 'RUS', russianGrade),
                    period: 'month'
                });
            }
        }

        // Russian Kindergarten (ages 3-6)
        if (age >= 3 && age <= 6) {
            options.push({
                campus,
                programme: t('prog_kg_rus'),
                programmeCode: 'KG_RUS',
                grade: 'Kindergarten',
                gradeCode: 'KG',
                price: getPrice(campus, 'KG_RUS', 'KG'),
                period: 'month'
            });
        }

        // Bilingual Kindergarten (ages 3-6)
        if (age >= 3 && age <= 6) {
            options.push({
                campus,
                programme: t('prog_kg_bi'),
                programmeCode: 'KG_BI',
                grade: 'Kindergarten',
                gradeCode: 'KG',
                price: getPrice(campus, 'KG_BI', 'KG'),
                period: 'month'
            });
        }
    });

    return options;
}

// ============================================================================
// PRICING DATA
// ============================================================================

function getPrice(campus, programmeCode, gradeCode) {
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

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace(/,/g, ' ');
}

// ============================================================================
// TUITION CALCULATION
// ============================================================================

function calculateTuition() {
    const allFilled = state.children.every(child => child.dob);

    if (!allFilled) {
        tg.showAlert(t('val_enter_dob') || 'Please enter date of birth for all children');
        return;
    }

    state.children.forEach(child => {
        child.age = calculateAge(child.dob);
        child.options = determineOptions(child.age, state.campusPreference);
    });

    displayResults();
    showScreen('resultsScreen');
}

// ============================================================================
// RESULTS DISPLAY
// ============================================================================

function displayResults() {
    const container = document.getElementById('resultsContainer');
    const siblingNote = document.getElementById('siblingNote');

    // Show sibling discount note
    if (state.children.length > 1) {
        siblingNote.classList.remove('hidden');
    } else {
        siblingNote.classList.add('hidden');
    }

    container.innerHTML = state.children.map((child, index) => {
        const childNumber = index + 1;

        // Too young case
        if (child.options.length === 1 && child.options[0].tooYoung) {
            return `
                <div class="bg-amber-50 border border-amber-200 rounded-3xl p-6 transition-all duration-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${t('child_number')} ${childNumber}</h3>
                    <p class="text-sm text-amber-900 mb-2">${t('age_as_of')}: ${child.age} ${t('as_of_date')}</p>
                    <p class="text-sm text-gray-700">${t('too_young_msg_1')}</p>
                    <p class="text-sm text-gray-700 mt-2">${t('too_young_msg_2')}</p>
                </div>
            `;
        }

        // Available options
        const optionsHtml = child.options.map(option => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                <div class="mb-3">
                    <h4 class="font-bold text-gray-900">${option.programme}</h4>
                    <p class="text-sm text-accent font-medium">${option.campus === 'MU' ? 'Mirzo-Ulugbek' : 'Yashnobod'}</p>
                </div>
                <p class="text-sm text-gray-600 mb-3">${option.grade}</p>
                <div class="text-left">
                    <div class="text-xs text-gray-400 uppercase tracking-wide">${t('price_from')}</div>
                    <div class="text-2xl font-bold text-primary">${formatPrice(option.price)}</div>
                    <div class="text-sm text-gray-500">sum per ${option.period} <span class="text-xs">${t('price_approx')}</span></div>
                </div>
            </div>
        `).join('');

        return `
            <div class="bg-gray-50 rounded-3xl p-6 transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-900">${t('child_number')} ${childNumber}</h3>
                    <span class="text-sm text-gray-500">${t('age_as_of')}: ${child.age}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

async function submitRequest() {
    const parentName = document.getElementById('parentName').value.trim();
    const parentPhone = document.getElementById('parentPhone').value.trim();
    const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value;
    const waitlist = document.getElementById('waitlistCheck').checked;

    if (!parentName) {
        tg.showAlert(t('val_enter_name') || 'Please enter your full name');
        return;
    }

    if (!parentPhone) {
        tg.showAlert(t('val_enter_phone') || 'Please enter your phone number');
        return;
    }

    document.getElementById('loadingOverlay').classList.remove('hidden');

    try {
        const applicationData = {
            parent: { name: parentName, phone: parentPhone },
            contactMethod,
            waitlist,
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

        const response = await fetch('/api/submit-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationData,
                telegramUser: tg.initDataUnsafe?.user || {}
            })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('loadingOverlay').classList.add('hidden');
            showScreen('thankYouScreen');
        } else {
            throw new Error(result.error || 'Failed to submit request');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingOverlay').classList.add('hidden');
        tg.showAlert(t('val_error') || 'Something went wrong. Please try again or contact us directly.');
    }
}

// ============================================================================
// TELEGRAM BACK BUTTON
// ============================================================================

tg.BackButton.onClick(() => goBack());

// ============================================================================
// GLOBAL FUNCTION EXPORTS (for onclick handlers)
// ============================================================================

window.selectLanguage = selectLanguage;
window.showLanguageSelection = showLanguageSelection;
window.goBack = goBack;
window.startCalculator = startCalculator;
window.selectCampus = selectCampus;
window.addChildDob = addChildDob;
window.removeChildDob = removeChildDob;
window.updateChildDob = updateChildDob;
window.calculateTuition = calculateTuition;
window.submitRequest = submitRequest;
