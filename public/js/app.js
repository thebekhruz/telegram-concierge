// Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// User data storage
const userData = {
    campus: '',
    program: '',
    numberOfChildren: 0,
    childAge: '',
    educationLevel: '',
    preferredLanguage: '',
    startDate: '',
    additionalComments: ''
};

// Step tracking
let currentStep = 0;
const steps = ['welcomeCard', 'step1', 'step2', 'step3', 'step4', 'step5'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Apply Telegram theme
    applyTelegramTheme();

    // Show welcome screen
    showStep(0);
});

// Apply Telegram theme colors
function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Set theme color
    if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty('--bg-light', tg.themeParams.bg_color);
    }

    if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty('--text-dark', tg.themeParams.text_color);
    }

    if (tg.themeParams.button_color) {
        document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color);
    }
}

// Start the journey
function startJourney() {
    currentStep = 1;
    showStep(currentStep);
    updateNavigation();
}

// Show specific step
function showStep(stepIndex) {
    // Hide all steps
    steps.forEach(step => {
        const element = document.getElementById(step);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Show current step
    const currentElement = document.getElementById(steps[stepIndex]);
    if (currentElement) {
        currentElement.style.display = 'block';
    }

    currentStep = stepIndex;
    updateNavigation();
}

// Update navigation buttons
function updateNavigation() {
    const backBtn = document.getElementById('backBtn');
    const startBtn = document.getElementById('startBtn');

    if (currentStep === 0) {
        backBtn.style.display = 'none';
        startBtn.style.display = 'block';
        startBtn.textContent = 'Get Started';
    } else if (currentStep === steps.length - 1) {
        // On summary/final step
        backBtn.style.display = 'none';
        startBtn.style.display = 'none';
    } else {
        backBtn.style.display = 'block';
        startBtn.style.display = 'none';
    }
}

// Go back to previous step
function goBack() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Campus Selection
function selectCampus(campus) {
    userData.campus = campus;

    // Visual feedback
    document.querySelectorAll('.campus-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.campus-card').classList.add('selected');

    // Move to next step after short delay
    setTimeout(() => {
        currentStep = 2;
        showStep(currentStep);
    }, 300);
}

// Program Selection
function selectProgram(program) {
    userData.program = program;

    // Visual feedback
    document.querySelectorAll('.program-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.program-card').classList.add('selected');

    // Move to next step after short delay
    setTimeout(() => {
        currentStep = 3;
        showStep(currentStep);
    }, 300);
}

// Number of Children Selection
function selectChildren(number) {
    userData.numberOfChildren = number;

    // Visual feedback
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');

    // Move to next step after short delay
    setTimeout(() => {
        currentStep = 4;
        showStep(currentStep);
    }, 300);
}

// Show Summary
function showSummary() {
    // Collect form data
    userData.childAge = document.getElementById('childAge').value;
    userData.educationLevel = document.getElementById('educationLevel').value;
    userData.preferredLanguage = document.getElementById('preferredLanguage').value;
    userData.startDate = document.getElementById('startDate').value;
    userData.additionalComments = document.getElementById('additionalComments').value;

    // Validate required fields
    if (!userData.childAge || !userData.educationLevel || !userData.preferredLanguage || !userData.startDate) {
        tg.showAlert('Please fill in all required fields');
        return;
    }

    // Display summary
    displaySummary();

    // Move to summary step
    currentStep = 5;
    showStep(currentStep);
}

// Display Summary
function displaySummary() {
    const campusNames = {
        'MU': 'MU Campus (Mirzo-Ulugbek)',
        'YASH': 'Yashnobod Campus'
    };

    const programNames = {
        'IB': 'International Baccalaureate',
        'RUS': 'Russian School',
        'KG_RUS': 'Russian Kindergarten',
        'KG_BI': 'Bilingual Kindergarten'
    };

    const languageNames = {
        'english': 'English',
        'russian': 'Russian',
        'bilingual': 'Bilingual (English + Russian)'
    };

    const educationNames = {
        'kindergarten': 'Kindergarten',
        'primary': 'Primary School',
        'secondary': 'Secondary School',
        'high': 'High School',
        'none': 'Not yet in school'
    };

    const startDateNames = {
        '2025-09': 'September 2025',
        '2026-01': 'January 2026',
        '2026-09': 'September 2026',
        'later': 'Later'
    };

    document.getElementById('summaryCampus').textContent = campusNames[userData.campus] || userData.campus;
    document.getElementById('summaryProgram').textContent = programNames[userData.program] || userData.program;
    document.getElementById('summaryChildren').textContent = userData.numberOfChildren;
    document.getElementById('summaryAge').textContent = userData.childAge;
    document.getElementById('summaryEducation').textContent = educationNames[userData.educationLevel] || userData.educationLevel;
    document.getElementById('summaryLanguage').textContent = languageNames[userData.preferredLanguage] || userData.preferredLanguage;
    document.getElementById('summaryStartDate').textContent = startDateNames[userData.startDate] || userData.startDate;
}

// Connect to Manager
async function connectToManager() {
    // Show loading state
    document.getElementById('step5').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    try {
        // Send data to backend
        const response = await fetch('/api/submit-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userData,
                telegramUser: tg.initDataUnsafe?.user || {}
            })
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            document.getElementById('loading').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';

            // Notify Telegram
            tg.showAlert('Thank you! A manager will contact you soon.');

            // Close mini app after 3 seconds
            setTimeout(() => {
                tg.close();
            }, 3000);
        } else {
            throw new Error(result.error || 'Failed to submit');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('step5').style.display = 'block';
        tg.showAlert('Something went wrong. Please try again or contact us directly.');
    }
}

// Handle back button
tg.BackButton.onClick(() => {
    if (currentStep > 1) {
        goBack();
    } else {
        tg.close();
    }
});

// Show back button when needed
function updateTelegramBackButton() {
    if (currentStep > 0) {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
}

// Update back button visibility when step changes
const originalShowStep = showStep;
showStep = function(stepIndex) {
    originalShowStep(stepIndex);
    updateTelegramBackButton();
};
