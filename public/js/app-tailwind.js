// Import Motion One for smooth animations
import { animate, stagger, spring } from "https://cdn.skypack.dev/motion@12.0.0";

// Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// Application state
const state = {
    language: 'en',
    campusPreference: null,
    children: [],
    navigationHistory: ['welcomeScreen']
};

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
    initializeAnimations();
});

// Initialize smooth animations
function initializeAnimations() {
    // Animate elements on page load
    const cards = document.querySelectorAll('.card, .menu-card, button');
    if (cards.length > 0) {
        animate(
            cards,
            { opacity: [0, 1], y: [20, 0] },
            { duration: 0.5, delay: stagger(0.1), easing: spring() }
        );
    }
}

// Apply Telegram theme
function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
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
        appHeader.classList.add('hidden');
        return;
    }

    // Show header with animation
    appHeader.classList.remove('hidden');
    animate(appHeader, { y: [-20, 0], opacity: [0, 1] }, { duration: 0.3, easing: spring() });

    // Show/hide back button
    if (state.navigationHistory.length > 1) {
        headerBackBtn.style.display = 'block';
    } else {
        headerBackBtn.style.display = 'none';
    }

    // Update language display
    currentLangDisplay.textContent = LANG_DISPLAY[state.language] || 'EN';

    // Update title based on screen
    const titles = {
        'menuScreen': t('menuTitle'),
        'campusScreen': t('selectCampus'),
        'dobScreen': t('childrenApplying'),
        'resultsScreen': t('availableOptions'),
        'thankYouScreen': t('thankYou')
    };
    headerTitle.textContent = titles[currentScreen] || t('admissions');
}

// Navigation with smooth transitions
function showScreen(screenId, addToHistory = true) {
    const allScreens = document.querySelectorAll('.screen');
    const targetScreen = document.getElementById(screenId);

    // Fade out current screen
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        animate(
            currentScreen,
            { opacity: [1, 0], y: [0, -10] },
            { duration: 0.2, easing: 'ease-out' }
        ).finished.then(() => {
            currentScreen.classList.remove('active');
        });
    }

    // Show new screen after a brief delay
    setTimeout(() => {
        allScreens.forEach(screen => screen.classList.remove('active'));
        targetScreen.classList.add('active');

        // Animate in new screen
        animate(
            targetScreen,
            { opacity: [0, 1], y: [20, 0] },
            { duration: 0.4, easing: spring({ stiffness: 200, damping: 20 }) }
        );

        // Animate child elements
        const elements = targetScreen.querySelectorAll('.animate-fade-in, button, .card');
        if (elements.length > 0) {
            animate(
                elements,
                { opacity: [0, 1], y: [10, 0] },
                { duration: 0.5, delay: stagger(0.05), easing: spring() }
            );
        }

        if (addToHistory) {
            state.navigationHistory.push(screenId);
        }

        // Update campus image if on DOB screen
        if (screenId === 'dobScreen' && state.campusPreference) {
            updateCampusImage();
        }

        updateHeader();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
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

function selectLanguage(lang) {
    state.language = lang;
    updateTranslations();
    state.navigationHistory = ['welcomeScreen'];
    showScreen('menuScreen');
}

function goToMenu() {
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

    // Animate image load
    animate(campusImage, { opacity: [0, 1], scale: [1.1, 1] }, { duration: 0.6, easing: 'ease-out' });
}

// Toggle collapsible sections with smooth animation
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.previousElementSibling;
    const icon = button.querySelector('.expand-icon');

    if (section.classList.contains('active')) {
        // Collapse
        animate(section, { maxHeight: [section.scrollHeight + 'px', '0px'], opacity: [1, 0] }, { duration: 0.3 }).finished.then(() => {
            section.classList.remove('active');
            section.style.maxHeight = '0';
        });
        icon.textContent = '+';
        animate(icon, { rotate: [45, 0] }, { duration: 0.3 });
    } else {
        // Expand
        section.classList.add('active');
        section.style.maxHeight = section.scrollHeight + 'px';
        animate(section, { maxHeight: ['0px', section.scrollHeight + 'px'], opacity: [0, 1] }, { duration: 0.3 });
        icon.textContent = '−';
        animate(icon, { rotate: [0, 45] }, { duration: 0.3 });
    }
}

// DOB Entry Management
function renderDobEntries() {
    const container = document.getElementById('childrenDobList');

    if (state.children.length === 0) {
        state.children.push({ dob: '', age: null, options: [] });
    }

    container.innerHTML = state.children.map((child, index) => `
        <div class="dob-entry bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-scale-in">
            <div class="flex items-center justify-between mb-3">
                <span class="font-semibold text-gray-900">Child ${index + 1}</span>
                ${index > 0 ? `<button onclick="removeChildDob(${index})" class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">Remove</button>` : ''}
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

    // Animate entries
    const entries = container.querySelectorAll('.dob-entry');
    animate(entries, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.3, delay: stagger(0.1) });
}

function addChildDob() {
    state.children.push({ dob: '', age: null, options: [] });
    renderDobEntries();
}

function removeChildDob(index) {
    const entries = document.querySelectorAll('.dob-entry');
    animate(entries[index], { opacity: [1, 0], scale: [1, 0.95] }, { duration: 0.2 }).finished.then(() => {
        state.children.splice(index, 1);
        renderDobEntries();
    });
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
            const pypLevel = age - 4;
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
            const mypLevel = age - 10;
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
            const dpLevel = age - 15;
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
            const russianGrade = age - 6;
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

// Price lookup
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

    if (programmeCode === 'RUS') {
        return prices[campus]?.[programmeCode]?.[gradeCode] || 0;
    }

    return prices[campus]?.[programmeCode]?.[gradeCode] || 0;
}

function getPeriod(campus, programmeCode, gradeCode) {
    if (programmeCode === 'IB' || programmeCode === 'KG_RUS' || programmeCode === 'KG_BI') {
        return programmeCode === 'RUS' ? 'month' : 'quarter';
    }
    return 'month';
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace(/,/g, ' ');
}

// Calculate Tuition
function calculateTuition() {
    const allFilled = state.children.every(child => child.dob);

    if (!allFilled) {
        tg.showAlert('Please enter date of birth for all children');
        return;
    }

    state.children.forEach(child => {
        child.age = calculateAge(child.dob);
        child.options = determineOptions(child.age, state.campusPreference);
    });

    displayResults();
    showScreen('resultsScreen');
}

// Display Results with animations
function displayResults() {
    const container = document.getElementById('resultsContainer');
    const siblingNote = document.getElementById('siblingNote');

    if (state.children.length > 1) {
        siblingNote.classList.remove('hidden');
        animate(siblingNote, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4 });
    } else {
        siblingNote.classList.add('hidden');
    }

    container.innerHTML = state.children.map((child, index) => {
        const childNumber = index + 1;

        if (child.options.length === 1 && child.options[0].tooYoung) {
            return `
                <div class="bg-amber-50 border border-amber-200 rounded-3xl p-6 animate-scale-in">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Child ${childNumber}</h3>
                    <p class="text-sm text-amber-900 mb-2">Age: ${child.age} (as of Sept 1, 2025)</p>
                    <p class="text-sm text-gray-700">This child will be under 3 years old at the start of the 2025–2026 academic year.</p>
                    <p class="text-sm text-gray-700 mt-2">We invite you to add them to our waitlist for future enrollment.</p>
                </div>
            `;
        }

        const optionsHtml = child.options.map(option => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                <div class="mb-3">
                    <h4 class="font-bold text-gray-900">${option.programme}</h4>
                    <p class="text-sm text-accent font-medium">${option.campus === 'MU' ? 'Mirzo-Ulugbek' : 'Yashnobod'}</p>
                </div>
                <p class="text-sm text-gray-600 mb-3">${option.grade}</p>
                <div class="text-left">
                    <div class="text-xs text-gray-400 uppercase tracking-wide">from</div>
                    <div class="text-2xl font-bold text-primary">${formatPrice(option.price)}</div>
                    <div class="text-sm text-gray-500">sum per ${option.period} <span class="text-xs">(approx.)</span></div>
                </div>
            </div>
        `).join('');

        return `
            <div class="bg-gray-50 rounded-3xl p-6 animate-fade-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-900">Child ${childNumber}</h3>
                    <span class="text-sm text-gray-500">Age: ${child.age}</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');

    // Animate result cards
    const cards = container.querySelectorAll('.animate-fade-in, .animate-scale-in');
    animate(cards, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: stagger(0.1) });
}

// Submit Request
async function submitRequest() {
    const parentName = document.getElementById('parentName').value.trim();
    const parentPhone = document.getElementById('parentPhone').value.trim();
    const contactMethod = document.querySelector('input[name="contactMethod"]:checked')?.value;
    const waitlist = document.getElementById('waitlistCheck').checked;

    if (!parentName) {
        tg.showAlert('Please enter your full name');
        return;
    }

    if (!parentPhone) {
        tg.showAlert('Please enter your phone number');
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
        tg.showAlert('Something went wrong. Please try again or contact us directly.');
    }
}

// Telegram back button
tg.BackButton.onClick(() => {
    tg.close();
});

tg.BackButton.show();
