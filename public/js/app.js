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
// LANGUAGE SELECTION - Define early so it's available immediately
// ============================================================================

/**
 * Select language and apply translations
 * Dynamically loads the selected language file
 * @param {string} lang - Language code (en, ru, uz, tr)
 * @param {boolean} skipNavigation - If true, don't navigate to valuePropositionScreen (used when called from modal)
 */
window.selectLanguage = async function(lang, skipNavigation = false) {
    console.log('selectLanguage called with:', lang);
    
    if (!lang || !['en', 'ru', 'uz', 'tr'].includes(lang)) {
        console.error('Invalid language:', lang);
        const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
        const errorMsg = tFunc ? tFunc('error_invalid_language', state.language || 'en') : 'Invalid language selected. Please try again.';
        alert(errorMsg);
        return;
    }
    
    try {
        // Update state
        state.language = lang;
        console.log('Language set to:', state.language);
        
        // Load the language file dynamically
        const loadLang = window.loadLanguage || (() => Promise.resolve());
        await loadLang(lang);
        console.log(`Language "${lang}" loaded`);
        
        // Navigate to next screen (unless skipNavigation is true)
        if (!skipNavigation) {
            const targetScreen = document.getElementById('valuePropositionScreen');
            const bottomNav = document.getElementById('bottomNav');
            const allScreens = document.querySelectorAll('.screen');
            
            if (targetScreen) {
                allScreens.forEach(screen => screen.classList.remove('active'));
                targetScreen.classList.add('active');
                if (bottomNav) {
                    bottomNav.classList.remove('hidden');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('Navigated to valuePropositionScreen');
            } else {
                console.error('valuePropositionScreen not found');
            }
        }
        
        // Apply translations after language is loaded
        const applyTranslationsNow = () => {
            if (typeof applyTranslations === 'function') {
                applyTranslations();
                return true;
            } else if (typeof window.applyTranslations === 'function') {
                window.applyTranslations();
                return true;
            }
            return false;
        };
        
        // Apply translations immediately
        applyTranslationsNow();
        
        // Re-render calculator form if it's visible (to update labels)
        // Wait a bit to ensure translations are loaded
        const calculatorScreen = document.getElementById('calculatorScreen');
        setTimeout(() => {
            applyTranslationsNow();
            // Re-render calculator after translations are loaded
            if (calculatorScreen && calculatorScreen.classList.contains('active')) {
                renderChildren();
            }
        }, 150);
        
    } catch (error) {
        console.error('Error in selectLanguage:', error);
        // Fallback: just navigate to next screen (if not skipping)
        if (!skipNavigation) {
            const targetScreen = document.getElementById('valuePropositionScreen');
            if (targetScreen) {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                targetScreen.classList.add('active');
                const bottomNav = document.getElementById('bottomNav');
                if (bottomNav) {
                    bottomNav.classList.remove('hidden');
                }
            }
        }
    }
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
// LANGUAGE SELECTION SCREEN
// ============================================================================

/**
 * Show language selection screen
 * Allows users to change language from the main menu
 */
window.showLanguageSelection = function() {
    // Create or show language selection modal/overlay
    const existingModal = document.getElementById('languageSelectionModal');
    
    if (existingModal) {
        existingModal.classList.remove('hidden');
        return;
    }
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'languageSelectionModal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-primary" data-i18n="select_language_title">Select Language</h2>
                <button onclick="closeLanguageSelection()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="space-y-3">
                <button onclick="selectLanguage('uz', true); closeLanguageSelection();" class="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" data-i18n="lang_uz">
                    O'zbekcha
                </button>

                <button onclick="selectLanguage('en', true); closeLanguageSelection();" class="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" data-i18n="lang_en">
                    English
                </button>

                <button onclick="selectLanguage('ru', true); closeLanguageSelection();" class="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" data-i18n="lang_ru">
                    Русский
                </button>

                <button onclick="selectLanguage('tr', true); closeLanguageSelection();" class="w-full px-6 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-sm border-2 border-gray-200 hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200" data-i18n="lang_tr">
                    Türkçe
                </button>
            </div>
        </div>
    `;
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLanguageSelection();
        }
    });
    
    document.body.appendChild(modal);
    
    // Apply translations to modal
    setTimeout(() => {
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }
    }, 50);
};

/**
 * Close language selection modal
 */
window.closeLanguageSelection = function() {
    const modal = document.getElementById('languageSelectionModal');
    if (modal) {
        modal.classList.add('hidden');
        // Remove after animation
        setTimeout(() => {
            modal.remove();
        }, 200);
    }
};

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

    if (!targetScreen) {
        console.error('Screen not found:', screenId);
        return;
    }

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
        const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
        const lang = state.language || 'en';
        const titles = {
            'tour': tFunc ? tFunc('lead_title_tour', lang) : 'Book Your School Tour',
            'openhouse': tFunc ? tFunc('lead_title_openhouse', lang) : 'Register for Open House',
            'interview': tFunc ? tFunc('lead_title_interview', lang) : 'Request Admissions Interview'
        };
        leadCaptureTitle.textContent = titles[param] || titles.tour;
    }

    // Re-apply translations when switching screens
    setTimeout(() => {
        applyTranslations();
        
        // Re-render calculator form when calculator screen is shown to update labels with current language
        if (screenId === 'calculatorScreen') {
            renderChildren();
        }
    }, 50);

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
    const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
    
    if (!tFunc) {
        console.warn('Translation function t() is not available yet');
        return;
    }
    
    console.log('Applying translations for language:', state.language);
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Found', elements.length, 'elements with data-i18n');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (!key) return;
        
        try {
            const translation = tFunc(key, state.language);
            if (translation && translation !== key) {
                // Preserve button text if it's a button with onclick
                if (element.tagName === 'BUTTON' && element.hasAttribute('onclick')) {
                    // For language buttons, keep the native language name
                    if (key.startsWith('lang_')) {
                        // Don't translate language button labels - they should stay in their native language
                        return;
                    }
                }
                element.textContent = translation;
            }
        } catch (error) {
            console.error('Error translating key:', key, error);
        }
    });
    
    // Handle placeholder translations
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (!key) return;
        
        try {
            const translation = tFunc(key, state.language);
            if (translation && translation !== key) {
                element.placeholder = translation;
            }
        } catch (error) {
            console.error('Error translating placeholder key:', key, error);
        }
    });
}

// selectLanguage is now defined earlier in the file (moved to top for immediate availability)

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

    const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
    const lang = state.language || 'en';
    
    // Helper function to get translation for current language with proper fallback
    const getTranslation = (key, fallback) => {
        if (!tFunc) return fallback;
        const translation = tFunc(key, lang);
        // If translation function returns the key itself, it means translation not found
        // Try English fallback, or use the provided fallback
        if (translation === key && lang !== 'en') {
            const enTranslation = tFunc(key, 'en');
            return enTranslation !== key ? enTranslation : fallback;
        }
        return translation !== key ? translation : fallback;
    };

    const childLabel = getTranslation('calculator_child_label', 'Child');
    const removeText = getTranslation('remove_child', 'Remove');
    const dobLabel = getTranslation('calculator_dob_label', 'Date of Birth');
    const programLabel = getTranslation('calculator_program_label', 'Program');
    const selectProgram = getTranslation('calculator_select_program', 'Select program...');
    const programKindergarten = getTranslation('calculator_program_kindergarten', 'Kindergarten');
    const programRussian = getTranslation('calculator_program_russian', 'Russian Stream');
    const programIB = getTranslation('calculator_program_ib', 'IB Stream');

    container.innerHTML = state.children.map((child, index) => `
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <span class="font-semibold text-gray-900">${childLabel} ${index + 1}</span>
                ${index > 0 ? `<button onclick="removeChild(${index})" class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">${removeText}</button>` : ''}
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">${dobLabel}</label>
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">${programLabel}</label>
                    <select
                        id="program-${index}"
                        onchange="updateChild(${index}, 'program', this.value)"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                        <option value="">${selectProgram}</option>
                        <option value="kindergarten" ${child.program === 'kindergarten' ? 'selected' : ''}>${programKindergarten}</option>
                        <option value="russian" ${child.program === 'russian' ? 'selected' : ''}>${programRussian}</option>
                        <option value="ib" ${child.program === 'ib' ? 'selected' : ''}>${programIB}</option>
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
        const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
        const lang = state.language || 'en';
        const errorMsg = tFunc ? tFunc('error_incomplete_calculator', lang) : 'Please enter date of birth and select program for all children';
        tg.showAlert(errorMsg);
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

    // Get translation function
    const tFunc = window.t || (typeof t !== 'undefined' ? t : null);
    const lang = state.language || 'en';
    
    // Program display names
    const programNames = {
        kindergarten: tFunc ? tFunc('calculator_program_kindergarten', lang) : 'Kindergarten',
        russian: tFunc ? tFunc('calculator_program_russian', lang) : 'Russian Stream',
        ib: tFunc ? tFunc('calculator_program_ib', lang) : 'IB Stream'
    };

    // Critical diploma information (corrected in Phase 1)
    const diplomaRussian = tFunc ? tFunc('calculator_diploma_russian', lang) : 'Earns: Uzbek State Certificate';
    const diplomaIB = tFunc ? tFunc('calculator_diploma_ib', lang) : 'Earns: IB Diploma + State Certificate (2 diplomas)';
    const diplomaInfo = {
        kindergarten: '',
        russian: `<p class="text-xs text-amber-700 mt-1">${diplomaRussian}</p>`,
        ib: `<p class="text-xs text-green-700 mt-1">${diplomaIB}</p>`
    };
    
    // Get translated text for sibling discount and other labels
    const siblingDiscountText = tFunc ? tFunc('calculator_sibling_discount', lang) : 'Multiple children: 10% discount applied to second child\'s tuition';
    const siblingDiscountAppliedText = tFunc ? tFunc('calculator_sibling_discount_applied', lang) : '10% sibling discount applied';
    const childLabel = tFunc ? tFunc('calculator_child_label', lang) : 'Child';
    const ageLabel = tFunc ? tFunc('calculator_age_label', lang) : 'Age';
    const sumPerYearApprox = tFunc ? tFunc('calculator_sum_per_year_approx', lang) : 'sum per year (approx.)';
    const totalAnnual = tFunc ? tFunc('calculator_total_annual', lang) : 'Total Annual Tuition';
    const sumPerYear = tFunc ? tFunc('calculator_sum_per_year', lang) : 'sum per year';
    
    const childrenHTML = childResults.map(child => `
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-gray-900">${childLabel} ${child.childNum}</h3>
                <span class="text-sm text-gray-500">${ageLabel}: ${child.age}</span>
            </div>
            <p class="text-gray-700 mb-2">${programNames[child.program]}</p>
            ${child.hasDiscount ? `<p class="text-sm text-green-600 mb-2">${siblingDiscountAppliedText}</p>` : ''}
            <div class="text-left">
                <div class="text-2xl font-bold text-primary">${formatPrice(child.finalPrice)}</div>
                <div class="text-sm text-gray-500">${sumPerYearApprox}</div>
                ${diplomaInfo[child.program]}
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = `
        ${state.children.length > 1 ? `<div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4"><p class="text-sm text-blue-900">${siblingDiscountText}</p></div>` : ''}

        <div class="space-y-4 mb-6">
            ${childrenHTML}
        </div>

        <div class="bg-primary text-white rounded-2xl p-6 text-center">
            <p class="text-sm opacity-90 mb-2">${totalAnnual}</p>
            <p class="text-4xl font-bold">${formatPrice(total)}</p>
            <p class="text-sm opacity-90 mt-2">${sumPerYear}</p>
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

// Ensure t function is available (from translations.js)
if (typeof t === 'undefined') {
    console.error('Translation function t() is not available. Make sure translations.js is loaded before app.js');
}

// selectLanguage is already defined on window at the top of the file
window.showScreen = showScreen;
window.addChild = addChild;
window.removeChild = removeChild;
window.updateChild = updateChild;
window.calculateTuition = calculateTuition;
window.applyTranslations = applyTranslations;
