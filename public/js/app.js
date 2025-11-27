// Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// Children counter
let childCounter = 0;
const children = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Apply Telegram theme
    applyTelegramTheme();

    // Add first child by default
    addChild();
});

// Apply Telegram theme colors
function applyTelegramTheme() {
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

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

// Tab Navigation
function showTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    const activeTabBtn = Array.from(document.querySelectorAll('.tab-btn')).find(
        btn => btn.textContent.toLowerCase().includes(tabName.toLowerCase())
    );

    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }

    // Show selected content
    const tabMap = {
        'apply': 'applyTab',
        'about': 'aboutTab',
        'location': 'locationTab',
        'faq': 'faqTab'
    };

    const contentId = tabMap[tabName];
    if (contentId) {
        document.getElementById(contentId).classList.add('active');
    }
}

// Add Child
function addChild() {
    childCounter++;
    const childId = `child-${childCounter}`;

    const childEntry = document.createElement('div');
    childEntry.className = 'child-entry';
    childEntry.id = childId;
    childEntry.innerHTML = `
        <div class="child-entry-header">
            <span class="child-entry-title">Child #${childCounter}</span>
            ${childCounter > 1 ? `<button type="button" class="remove-child-btn" onclick="removeChild('${childId}')">Remove</button>` : ''}
        </div>

        <div class="form-group">
            <label>Child's Name *</label>
            <input type="text" class="form-control child-name" placeholder="Enter child's name" required>
        </div>

        <div class="form-group">
            <label>Program *</label>
            <select class="form-control child-program" required onchange="updateGradeOptions(this)">
                <option value="">Select program...</option>
                <option value="IB">International Baccalaureate (IB)</option>
                <option value="RUS">Russian School (Grades 1-11)</option>
                <option value="KG_RUS">Russian Kindergarten</option>
                <option value="KG_BI">Bilingual Kindergarten</option>
            </select>
        </div>

        <div class="form-group grade-group" style="display: none;">
            <label>Grade/Level *</label>
            <select class="form-control child-grade" required>
                <option value="">Select grade...</option>
            </select>
        </div>
    `;

    document.getElementById('childrenList').appendChild(childEntry);
    children.push({ id: childId, counter: childCounter });
}

// Remove Child
function removeChild(childId) {
    const childElement = document.getElementById(childId);
    if (childElement) {
        childElement.remove();
        const index = children.findIndex(c => c.id === childId);
        if (index > -1) {
            children.splice(index, 1);
        }
        // Renumber remaining children
        renumberChildren();
    }
}

// Renumber Children
function renumberChildren() {
    const childEntries = document.querySelectorAll('.child-entry');
    childEntries.forEach((entry, index) => {
        const title = entry.querySelector('.child-entry-title');
        if (title) {
            title.textContent = `Child #${index + 1}`;
        }
    });
}

// Update Grade Options
function updateGradeOptions(selectElement) {
    const childEntry = selectElement.closest('.child-entry');
    const gradeGroup = childEntry.querySelector('.grade-group');
    const gradeSelect = childEntry.querySelector('.child-grade');
    const program = selectElement.value;

    // Clear existing options
    gradeSelect.innerHTML = '<option value="">Select grade...</option>';

    if (!program) {
        gradeGroup.style.display = 'none';
        return;
    }

    gradeGroup.style.display = 'block';

    // Populate grade options based on program
    if (program === 'IB') {
        const ibGrades = [
            { value: 'KG', label: 'Kindergarten' },
            { value: 'PYP1', label: 'PYP 1' },
            { value: 'PYP2', label: 'PYP 2' },
            { value: 'PYP3', label: 'PYP 3' },
            { value: 'PYP4', label: 'PYP 4' },
            { value: 'PYP5', label: 'PYP 5' },
            { value: 'MYP1', label: 'MYP 1' },
            { value: 'MYP2', label: 'MYP 2' },
            { value: 'MYP3', label: 'MYP 3' },
            { value: 'MYP4', label: 'MYP 4' },
            { value: 'MYP5', label: 'MYP 5' },
            { value: 'DP1', label: 'DP 1 (Year 11)' },
            { value: 'DP2', label: 'DP 2 (Year 12)' }
        ];
        ibGrades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade.value;
            option.textContent = grade.label;
            gradeSelect.appendChild(option);
        });
    } else if (program === 'RUS') {
        for (let i = 1; i <= 11; i++) {
            const option = document.createElement('option');
            option.value = `Grade${i}`;
            option.textContent = `Grade ${i}`;
            gradeSelect.appendChild(option);
        }
    } else if (program === 'KG_RUS' || program === 'KG_BI') {
        const option = document.createElement('option');
        option.value = 'KG';
        option.textContent = 'Kindergarten';
        gradeSelect.appendChild(option);
        gradeSelect.value = 'KG';
    }
}

// Toggle FAQ
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    button.classList.toggle('active');
    answer.classList.toggle('active');
}

// Submit Application
async function submitApplication() {
    // Validate required fields
    const parentName = document.getElementById('parentName').value.trim();
    const campus = document.querySelector('input[name="campus"]:checked');
    const startDate = document.getElementById('startDate').value;
    const preferredLanguage = document.getElementById('preferredLanguage').value;

    if (!parentName) {
        tg.showAlert('Please enter your full name');
        return;
    }

    if (!campus) {
        tg.showAlert('Please select a campus');
        return;
    }

    if (!startDate) {
        tg.showAlert('Please select a start date');
        return;
    }

    if (!preferredLanguage) {
        tg.showAlert('Please select preferred language of instruction');
        return;
    }

    // Collect children data
    const childrenData = [];
    const childEntries = document.querySelectorAll('.child-entry');

    for (let i = 0; i < childEntries.length; i++) {
        const entry = childEntries[i];
        const childName = entry.querySelector('.child-name').value.trim();
        const program = entry.querySelector('.child-program').value;
        const grade = entry.querySelector('.child-grade').value;

        if (!childName) {
            tg.showAlert(`Please enter name for Child #${i + 1}`);
            return;
        }

        if (!program) {
            tg.showAlert(`Please select program for Child #${i + 1}`);
            return;
        }

        if (!grade) {
            tg.showAlert(`Please select grade/level for Child #${i + 1}`);
            return;
        }

        childrenData.push({
            name: childName,
            program: program,
            grade: grade
        });
    }

    if (childrenData.length === 0) {
        tg.showAlert('Please add at least one child');
        return;
    }

    // Collect all form data
    const applicationData = {
        parent: {
            name: parentName,
            email: document.getElementById('parentEmail').value.trim(),
            phone: document.getElementById('parentPhone').value.trim()
        },
        campus: campus.value,
        children: childrenData,
        startDate: startDate,
        preferredLanguage: preferredLanguage,
        referralSource: document.getElementById('referralSource').value,
        additionalComments: document.getElementById('additionalComments').value.trim(),
        campusTourRequested: document.getElementById('tourRequest').checked
    };

    // Show loading
    document.getElementById('loading').style.display = 'flex';

    try {
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
            // Show success message
            document.getElementById('loading').style.display = 'none';
            document.getElementById('successMessage').style.display = 'flex';

            // Close after 3 seconds
            setTimeout(() => {
                tg.close();
            }, 3000);
        } else {
            throw new Error(result.error || 'Failed to submit application');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').style.display = 'none';
        tg.showAlert('Something went wrong. Please try again or contact us directly.');
    }
}

// Telegram back button
tg.BackButton.onClick(() => {
    tg.close();
});

// Always show back button
tg.BackButton.show();
