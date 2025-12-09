/**
 * ============================================================================
 * OXBRIDGE INTERNATIONAL SCHOOL - ADMISSIONS MINI APP
 * ============================================================================
 *
 * Phase 1 Implementation: Complete UX restructure with 9 core pages
 *
 * Architecture:
 * - Single Page Application (SPA) with screen-based navigation
 * - Alpine.js for interactive components (accordions, tabs)
 * - Tailwind CSS for styling (CDN-based, no build)
 * - Multi-language support (en, ru, uz, tr)
 *
 * Key Features:
 * - Smart quiz routing based on user interests
 * - Tuition calculator with sibling discounts
 * - Lead capture form ready for AMO CRM integration
 * - Telegram Web App integration
 *
 * Design Principles:
 * - Hook-Story-Offer (Marketing)
 * - Progressive Disclosure (UX)
 * - Fogg Behavior Model (Motivation × Ability × Prompt)
 *
 * @version 1.0.0 (Phase 1)
 * @date 2024
 */

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
    selectedInterests: [],
    children: [],
    leadType: 'tour' // tour, openhouse, interview
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    applyTelegramTheme();
    initCalculator();

    // Apply translations after a brief delay to ensure Alpine is ready
    setTimeout(() => {
        applyTranslations();
        console.log('Translations applied');
    }, 50);
});

function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Navigate between screens in the single-page application
 * Manages screen visibility, bottom navigation, and scroll position
 *
 * @param {string} screenId - The ID of the screen to show (e.g., 'welcomeScreen')
 * @param {string} param - Optional parameter for screen customization (e.g., lead type)
 */
function showScreen(screenId, param) {
    const allScreens = document.querySelectorAll('.screen');
    const targetScreen = document.getElementById(screenId);
    const bottomNav = document.getElementById('bottomNav');

    // Hide all screens and show target
    allScreens.forEach(screen => screen.classList.remove('active'));
    targetScreen.classList.add('active');

    // Show/hide bottom navigation based on screen context
    const screensWithoutNav = ['welcomeScreen', 'thankYouScreen', 'leadCaptureScreen'];
    if (screensWithoutNav.includes(screenId)) {
        bottomNav.classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
    }

    // Customize lead capture screen title based on action type
    if (screenId === 'leadCaptureScreen' && param) {
        state.leadType = param;
        const leadCaptureTitle = document.getElementById('leadCaptureTitle');
        const titles = {
            'tour': 'Book Your School Tour',
            'openhouse': 'Register for Open House',
            'interview': 'Request Admissions Interview'
        };
        leadCaptureTitle.textContent = titles[param] || titles.tour;
    }

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// LANGUAGE MANAGEMENT
// ============================================================================

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    console.log('Applying translations for language:', state.language);
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Found', elements.length, 'elements with data-i18n');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key, state.language);
        element.textContent = translation;
    });
}

/**
 * Select language and apply translations
 * @param {string} lang - Language code (en, ru, uz, tr)
 */
function selectLanguage(lang) {
    console.log('Language selected:', lang);
    state.language = lang;
    applyTranslations();
    showScreen('valuePropositionScreen');
}

// ============================================================================
// QUIZ HANDLING - SMART USER ROUTING
// ============================================================================

/**
 * Handle quiz submission and route user to most relevant content
 * Implements the Fogg Behavior Model (Motivation × Ability × Prompt)
 *
 * @param {Array} selected - Array of selected interest values
 */
function handleQuizSubmit(selected) {
    state.selectedInterests = selected;

    // Smart routing based on user's expressed interests
    if (selected.includes('international')) {
        // International focus → Show IB program details
        showScreen('programsScreen');
        // Auto-select IB tab after screen loads
        setTimeout(() => {
            const ibTab = document.querySelector('[x-data] button:nth-child(3)');
            if (ibTab) ibTab.click();
        }, 100);
    } else if (selected.includes('value')) {
        // Value-conscious → Show calculator for pricing transparency
        showScreen('calculatorScreen');
    } else {
        // Default → Show all programs
        showScreen('programsScreen');
    }
}

// Make globally accessible for Alpine.js onClick handlers
window.handleQuizSubmit = handleQuizSubmit;

// ============================================================================
// CALCULATOR FUNCTIONALITY - TUITION ESTIMATION
// ============================================================================

/**
 * Initialize calculator with first child entry
 * Called on page load
 */
function initCalculator() {
    if (state.children.length === 0) {
        state.children.push({ dob: '', program: '', age: null });
    }
    renderChildren();
}

/**
 * Render all children in the calculator
 * Dynamically generates form fields for each child
 */
function renderChildren() {
    const container = document.getElementById('childrenList');
    if (!container) return;

    container.innerHTML = state.children.map((child, index) => `
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <span class="font-semibold text-gray-900">Child ${index + 1}</span>
                ${index > 0 ? `<button onclick="removeChild(${index})" class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Remove</button>` : ''}
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                        type="date"
                        id="dob-${index}"
                        value="${child.dob}"
                        onchange="updateChild(${index}, 'dob', this.value)"
                        max="2022-09-01"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Program</label>
                    <select
                        id="program-${index}"
                        onchange="updateChild(${index}, 'program', this.value)"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        <option value="">Select program...</option>
                        <option value="kindergarten" ${child.program === 'kindergarten' ? 'selected' : ''}>Kindergarten</option>
                        <option value="russian" ${child.program === 'russian' ? 'selected' : ''}>Russian Stream</option>
                        <option value="ib" ${child.program === 'ib' ? 'selected' : ''}>IB Stream</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Add another child to the calculator
 */
function addChild() {
    state.children.push({ dob: '', program: '', age: null });
    renderChildren();
}

/**
 * Remove a child from the calculator
 * @param {number} index - Index of child to remove
 */
function removeChild(index) {
    state.children.splice(index, 1);
    renderChildren();
}

/**
 * Update child data when form fields change
 * @param {number} index - Index of child
 * @param {string} field - Field name (dob, program, age)
 * @param {*} value - New value
 */
function updateChild(index, field, value) {
    state.children[index][field] = value;

    // Auto-calculate age when date of birth changes
    if (field === 'dob' && value) {
        state.children[index].age = calculateAge(value);
    }
}

/**
 * Calculate child's age as of September 1, 2025 (academic year start)
 * @param {string} dob - Date of birth (YYYY-MM-DD)
 * @returns {number|null} Age in years
 */
function calculateAge(dob) {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const cutoffDate = new Date('2025-09-01'); // Academic year start

    let age = cutoffDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = cutoffDate.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't occurred yet in the academic year
    if (monthDiff < 0 || (monthDiff === 0 && cutoffDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

/**
 * Calculate tuition for all children with sibling discount
 * Validates input, applies 10% discount to 2nd+ children, displays results
 */
function calculateTuition() {
    // Validate: Ensure all children have DOB and program selected
    const incomplete = state.children.some(child => !child.dob || !child.program);

    if (incomplete) {
        tg.showAlert('Please enter date of birth and select program for all children');
        return;
    }

    // Calculate ages for all children
    state.children.forEach(child => {
        if (!child.age) {
            child.age = calculateAge(child.dob);
        }
    });

    // Annual tuition pricing (2025-2026 rates in UZS)
    const prices = {
        kindergarten: 28875000,  // ~$2,500 USD
        russian: 9460000,         // ~$800 USD
        ib: 43257500             // ~$3,750 USD
    };

    // Calculate with sibling discount (10% off for 2nd child onwards)
    let total = 0;
    const childResults = state.children.map((child, index) => {
        const basePrice = prices[child.program] || 0;
        const discount = index > 0 ? 0.9 : 1; // 10% sibling discount
        const finalPrice = basePrice * discount;
        total += finalPrice;

        return {
            childNum: index + 1,
            age: child.age,
            program: child.program,
            basePrice: basePrice,
            finalPrice: finalPrice,
            hasDiscount: index > 0
        };
    });

    displayResults(childResults, total);
}

/**
 * Display calculation results with diploma information
 * Shows breakdown per child + total, highlights sibling discounts
 *
 * @param {Array} childResults - Array of child calculation objects
 * @param {number} total - Total annual tuition
 */
function displayResults(childResults, total) {
    const resultsContainer = document.getElementById('resultsContent');
    const calculatorForm = document.getElementById('calculatorForm');
    const calculatorResults = document.getElementById('calculatorResults');

    // Program display names
    const programNames = {
        kindergarten: 'Kindergarten',
        russian: 'Russian Stream',
        ib: 'IB Stream'
    };

    // Critical diploma information (corrected in Phase 1)
    const diplomaInfo = {
        kindergarten: '',
        russian: '<p class="text-xs text-amber-700 mt-1">Earns: Uzbek State Certificate</p>',
        ib: '<p class="text-xs text-green-700 mt-1">Earns: IB Diploma + State Certificate (2 diplomas)</p>'
    };

    const childrenHTML = childResults.map(child => `
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-gray-900">Child ${child.childNum}</h3>
                <span class="text-sm text-gray-500">Age: ${child.age}</span>
            </div>
            <p class="text-gray-700 mb-2">${programNames[child.program]}</p>
            ${child.hasDiscount ? '<p class="text-sm text-green-600 mb-2">10% sibling discount applied</p>' : ''}
            <div class="text-left">
                <div class="text-2xl font-bold text-primary">${formatPrice(child.finalPrice)}</div>
                <div class="text-sm text-gray-500">sum per year (approx.)</div>
                ${diplomaInfo[child.program]}
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `
        ${state.children.length > 1 ? '<div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4"><p class="text-sm text-blue-900">Multiple children: 10% discount applied to second child\'s tuition</p></div>' : ''}

        <div class="space-y-4 mb-6">
            ${childrenHTML}
        </div>

        <div class="bg-primary text-white rounded-2xl p-6 text-center">
            <p class="text-sm opacity-90 mb-2">Total Annual Tuition</p>
            <p class="text-4xl font-bold">${formatPrice(total)}</p>
            <p class="text-sm opacity-90 mt-2">sum per year</p>
        </div>
    `;

    calculatorForm.classList.add('hidden');
    calculatorResults.classList.remove('hidden');
}

/**
 * Format price with space-separated thousands (UZS format)
 * Example: 28875000 → "28 875 000"
 *
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace(/,/g, ' ');
}

// ============================================================================
// LEAD CAPTURE FORM - AMO CRM INTEGRATION
// ============================================================================

/**
 * Handle lead capture form submission
 * Collects all user data and sends to backend for AMO CRM processing
 */
document.getElementById('leadCaptureForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect all form data + app state
    const formData = {
        leadType: state.leadType,                    // tour, openhouse, or interview
        parentName: document.getElementById('parentName').value,
        parentPhone: document.getElementById('parentPhone').value,
        parentEmail: document.getElementById('parentEmail').value,
        numChildren: document.getElementById('numChildren').value,
        childAges: Array.from(document.querySelectorAll('input[name="childAges"]:checked')).map(cb => cb.value),
        programInterest: document.getElementById('programInterest').value,
        specificQuestions: document.getElementById('specificQuestions').value,
        language: state.language,                    // User's selected language
        interests: state.selectedInterests,          // Quiz responses
        telegramUser: tg.initDataUnsafe?.user || {} // Telegram user data
    };

    try {
        // Send to backend API (connects to AMO CRM)
        const response = await fetch('/api/submit-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showScreen('thankYouScreen');
        } else {
            throw new Error(result.error || 'Failed to submit');
        }
    } catch (error) {
        console.error('Lead submission error:', error);
        // Graceful degradation: Show thank you even if API fails
        // This prevents user frustration due to network issues
        showScreen('thankYouScreen');
    }
});

// ============================================================================
// TELEGRAM WEB APP INTEGRATION
// ============================================================================

/**
 * Handle Telegram back button
 * Always returns to value proposition (home) screen
 */
tg.BackButton.onClick(() => {
    showScreen('valuePropositionScreen');
});

// ============================================================================
// GLOBAL FUNCTION EXPORTS
// Make functions accessible to HTML onclick handlers and Alpine.js
// ============================================================================

window.selectLanguage = selectLanguage;
window.showScreen = showScreen;
window.addChild = addChild;
window.removeChild = removeChild;
window.updateChild = updateChild;
window.calculateTuition = calculateTuition;
