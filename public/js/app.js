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

    // Update language display
    currentLangDisplay.textContent = LANG_DISPLAY[state.language] || 'EN';

    // Update title based on screen
    const titles = {
        'menuScreen': 'Admissions 2025–2026',
        'campusScreen': 'Choose Campus',
        'dobScreen': 'Enter Dates of Birth',
        'resultsScreen': 'Calculation Results',
        'thankYouScreen': 'Thank You'
    };
    headerTitle.textContent = titles[currentScreen] || 'Admissions';
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

    updateHeader();
    window.scrollTo(0, 0);
}

function goBack() {
    if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop(); // Remove current screen
        const previousScreen = state.navigationHistory[state.navigationHistory.length - 1];
        showScreen(previousScreen, false);
    }
}

function showLanguageSelection() {
    // Clear history and go to welcome screen
    state.navigationHistory = ['welcomeScreen'];
    showScreen('welcomeScreen', false);
}

function selectLanguage(lang) {
    state.language = lang;
    state.navigationHistory = ['welcomeScreen'];
    showScreen('menuScreen');
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
    renderDobEntries();
    showScreen('dobScreen');
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
        tg.showAlert('Please enter date of birth for all children');
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
        tg.showAlert('Please enter your full name');
        return;
    }

    if (!parentPhone) {
        tg.showAlert('Please enter your phone number');
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
        tg.showAlert('Something went wrong. Please try again or contact us directly.');
    }
}

// Telegram back button
tg.BackButton.onClick(() => {
    tg.close();
});

// Show back button
tg.BackButton.show();
