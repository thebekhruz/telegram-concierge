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
    applyTelegramTheme();
    initCalculator();
});

function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

function showScreen(screenId, param) {
    const allScreens = document.querySelectorAll('.screen');
    const targetScreen = document.getElementById(screenId);
    const bottomNav = document.getElementById('bottomNav');

    allScreens.forEach(screen => screen.classList.remove('active'));
    targetScreen.classList.add('active');

    // Show/hide bottom navigation
    const screensWithoutNav = ['welcomeScreen', 'thankYouScreen', 'leadCaptureScreen'];
    if (screensWithoutNav.includes(screenId)) {
        bottomNav.classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
    }

    // Handle lead capture screen parameter
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// LANGUAGE MANAGEMENT
// ============================================================================

function selectLanguage(lang) {
    state.language = lang;
    // Show value proposition after language selection
    showScreen('valuePropositionScreen');
}

// ============================================================================
// QUIZ HANDLING
// ============================================================================

function handleQuizSubmit(selected) {
    state.selectedInterests = selected;

    // Smart routing based on selections
    if (selected.includes('international')) {
        // Show programs screen with IB tab active
        showScreen('programsScreen');
        // Trigger IB tab click after a short delay
        setTimeout(() => {
            const ibTab = document.querySelector('[x-data] button:nth-child(3)');
            if (ibTab) ibTab.click();
        }, 100);
    } else if (selected.includes('value')) {
        showScreen('calculatorScreen');
    } else {
        showScreen('programsScreen');
    }
}

// Make it globally accessible for Alpine.js
window.handleQuizSubmit = handleQuizSubmit;

// ============================================================================
// CALCULATOR FUNCTIONALITY
// ============================================================================

function initCalculator() {
    // Add first child by default
    if (state.children.length === 0) {
        state.children.push({ dob: '', program: '', age: null });
    }
    renderChildren();
}

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

function addChild() {
    state.children.push({ dob: '', program: '', age: null });
    renderChildren();
}

function removeChild(index) {
    state.children.splice(index, 1);
    renderChildren();
}

function updateChild(index, field, value) {
    state.children[index][field] = value;

    // Calculate age if DOB is updated
    if (field === 'dob' && value) {
        state.children[index].age = calculateAge(value);
    }
}

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

function calculateTuition() {
    // Validate all children have DOB and program
    const incomplete = state.children.some(child => !child.dob || !child.program);

    if (incomplete) {
        tg.showAlert('Please enter date of birth and select program for all children');
        return;
    }

    // Calculate ages
    state.children.forEach(child => {
        if (!child.age) {
            child.age = calculateAge(child.dob);
        }
    });

    // Simple pricing (placeholder - will be enhanced)
    const prices = {
        kindergarten: 28875000,
        russian: 9460000,
        ib: 43257500
    };

    // Calculate total
    let total = 0;
    const childResults = state.children.map((child, index) => {
        const basePrice = prices[child.program] || 0;
        const discount = index > 0 ? 0.9 : 1; // 10% discount for 2nd child
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

function displayResults(childResults, total) {
    const resultsContainer = document.getElementById('resultsContent');
    const calculatorForm = document.getElementById('calculatorForm');
    const calculatorResults = document.getElementById('calculatorResults');

    const programNames = {
        kindergarten: 'Kindergarten',
        russian: 'Russian Stream',
        ib: 'IB Stream'
    };

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

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace(/,/g, ' ');
}

// ============================================================================
// LEAD CAPTURE FORM
// ============================================================================

document.getElementById('leadCaptureForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        leadType: state.leadType,
        parentName: document.getElementById('parentName').value,
        parentPhone: document.getElementById('parentPhone').value,
        parentEmail: document.getElementById('parentEmail').value,
        numChildren: document.getElementById('numChildren').value,
        childAges: Array.from(document.querySelectorAll('input[name="childAges"]:checked')).map(cb => cb.value),
        programInterest: document.getElementById('programInterest').value,
        specificQuestions: document.getElementById('specificQuestions').value,
        language: state.language,
        interests: state.selectedInterests,
        telegramUser: tg.initDataUnsafe?.user || {}
    };

    try {
        // TODO: Send to AMO CRM
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
        console.error('Error:', error);
        // For now, still show thank you page even if API fails
        showScreen('thankYouScreen');
    }
});

// ============================================================================
// TELEGRAM BACK BUTTON
// ============================================================================

tg.BackButton.onClick(() => {
    // Navigate back to value proposition (home)
    showScreen('valuePropositionScreen');
});

// ============================================================================
// GLOBAL FUNCTION EXPORTS
// ============================================================================

window.selectLanguage = selectLanguage;
window.showScreen = showScreen;
window.addChild = addChild;
window.removeChild = removeChild;
window.updateChild = updateChild;
window.calculateTuition = calculateTuition;
