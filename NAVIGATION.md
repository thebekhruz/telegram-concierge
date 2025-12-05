# Oxbridge Admissions Mini App - Navigation & Structure Guide

## 📋 Table of Contents
- [Page Structure](#page-structure)
- [Navigation Flow](#navigation-flow)
- [FAQ Locations](#faq-locations)
- [Translation Keys](#translation-keys)
- [Component Reference](#component-reference)

---

## 🗺️ Page Structure

### Page 1: Welcome / Language Selection
- **Screen ID**: `welcomeScreen`
- **File**: `public/index.html` (lines 23-46)
- **Purpose**: Initial screen for language selection
- **Components**:
  - Logo display
  - Welcome title & subtitle
  - Language selection buttons (UZ, RU, TR, EN)
- **Navigation**: 
  - Entry point (first screen)
  - → Menu (after language selection)

---

### Page 2: Main Menu / Admissions Menu
- **Screen ID**: `menuScreen`
- **File**: `public/index.html` (lines 48-219)
- **Purpose**: Main navigation hub
- **Components**:
  - Tuition Calculator button (primary action)
  - Collapsible sections:
    - **What is included in tuition** (`includedSection`)
    - **Campuses & location** (`campusSection`)
    - **What is IB?** (`ibSection`) - includes IB FAQ
    - **FAQ Section** (`faqSection`) - 7 general FAQs
- **Navigation**:
  - ← Welcome (via language selection)
  - → Campus Selection (via calculator button)
  - → All collapsible sections (expandable in place)

---

### Page 3: Campus Selection
- **Screen ID**: `campusScreen`
- **File**: `public/index.html` (lines 221-251)
- **Purpose**: Select preferred campus for calculation
- **Components**:
  - Campus option cards:
    - Mirzo-Ulugbek Campus (MU)
    - Yashnobod Campus (YASH)
    - Show both campuses (BOTH)
  - **Stream Choice FAQ** (embedded)
- **Navigation**:
  - ← Main Menu
  - → DOB Entry (after campus selection)

---

### Page 4: Date of Birth Entry
- **Screen ID**: `dobScreen`
- **File**: `public/index.html` (lines 253-280)
- **Purpose**: Enter children's date of birth
- **Components**:
  - **Early Education FAQ** (embedded at top)
  - Dynamic DOB input list (rendered via JavaScript)
  - Add child button
  - Calculate tuition button
- **Navigation**:
  - ← Campus Selection
  - → Results (after calculation)

---

### Page 5: Results & Submission
- **Screen ID**: `resultsScreen`
- **File**: `public/index.html` (lines 281-368)
- **Purpose**: Display calculation results and collect parent information
- **Components**:
  - Results container (dynamically generated)
  - **Value FAQ** (embedded)
  - **Outcomes FAQ** (embedded)
  - Sibling note (conditional display)
  - **Next Steps FAQ** (embedded)
  - Submission form:
    - Parent name
    - Phone number
    - Contact method (Telegram/Phone)
    - Waitlist checkbox
    - Submit button
- **Navigation**:
  - ← DOB Entry
  - → Thank You (after submission)

---

### Page 6: Thank You / Confirmation
- **Screen ID**: `thankYouScreen`
- **File**: `public/index.html` (lines 369-382)
- **Purpose**: Confirmation after successful submission
- **Components**:
  - Success icon
  - Thank you message
  - Close button
- **Navigation**:
  - ← Results (after submission)
  - → Close app

---

## 🔄 Navigation Flow

```
Welcome Screen
    ↓ (select language)
Main Menu
    ↓ (click calculator)
Campus Selection
    ↓ (select campus)
DOB Entry
    ↓ (calculate)
Results & Submission
    ↓ (submit form)
Thank You
    ↓ (close)
Exit
```

### Alternative Paths:
- **Main Menu** → Expand any collapsible section (stays on menu)
- **Any screen** → Back button → Previous screen
- **Results** → Modify children → DOB Entry

---

## ❓ FAQ Locations

### Main Menu Page (`menuScreen`)
1. **FAQ Section** (collapsible) - Contains 7 general FAQs:
   - Philosophy: "Чем Oxbridge отличается от других школ в Ташкенте?"
   - Academic Support: "А если у ребёнка проблемы с учёбой?"
   - Quality: "У вас 1100+ учеников. Как вы следите за качеством?"
   - Competition: "Мой ребёнок привык к рейтингам..."
   - Safety: "Меня беспокоит безопасность..."
   - Parent Involvement: "Насколько активно должны участвовать родители?"
   - Not Right Fit: "Что, если мы начнём и поймём, что это не наше?"

2. **IB Section** (within IB collapsible):
   - IB Program: "Я ничего не знаю про IB. Это только для тех, кто едет за границу?"

### Campus Selection Page (`campusScreen`)
- **Stream Choice FAQ**: "Русский поток или IB поток? Что выбрать для моего ребёнка?"

### DOB Entry Page (`dobScreen`)
- **Early Education FAQ**: "Ребёнку всего 2 года. Зачем так рано думать о школе?"

### Results Page (`resultsScreen`)
- **Value FAQ**: "Это дорого. Как понять, что оно того стоит?"
- **Outcomes FAQ**: "Куда поступают ваши выпускники?"
- **Next Steps FAQ**: "Как сделать следующий шаг?"

---

## 🌐 Translation Keys Structure

### File Location
- `public/js/translations/{lang}.json` (en, uz, ru, tr)

### Key Structure:
```
{
  "welcome": { ... },
  "header": { ... },
  "menu": { ... },
  "campus": { ... },
  "dob": { ... },
  "results": { ... },
  "submit": { ... },
  "thankYou": { ... },
  "included": { ... },
  "campusInfo": { ... },
  "ib": { ... },
  "programmes": { ... },
  "periods": { ... },
  "faq": {
    "title": "...",
    "philosophy": { "question": "...", "answer": "..." },
    "earlyEducation": { "question": "...", "answer": "..." },
    "ibProgram": { "question": "...", "answer": "..." },
    "academicSupport": { "question": "...", "answer": "..." },
    "quality": { "question": "...", "answer": "..." },
    "competition": { "question": "...", "answer": "..." },
    "streamChoice": { "question": "...", "answer": "..." },
    "outcomes": { "question": "...", "answer": "..." },
    "safety": { "question": "...", "answer": "..." },
    "parentInvolvement": { "question": "...", "answer": "..." },
    "value": { "question": "...", "answer": "..." },
    "notRightFit": { "question": "...", "answer": "..." },
    "nextSteps": { "question": "...", "answer": "..." }
  }
}
```

---

## 🧩 Component Reference

### JavaScript Functions
- **File**: `public/js/app.js`
- **Navigation Functions**:
  - `showScreen(screenId, addToHistory)` - Navigate to screen
  - `goBack()` - Navigate to previous screen
  - `goToMenu()` - Navigate to main menu
  - `selectLanguage(lang)` - Change language and go to menu
  - `startCalculator()` - Start calculator flow
  - `selectCampus(campus)` - Select campus and go to DOB
  - `calculateTuition()` - Calculate and show results
  - `submitRequest()` - Submit form data
- **UI Functions**:
  - `toggleSection(sectionId)` - Toggle collapsible sections
  - `toggleFaqItem(button)` - Toggle FAQ accordion
  - `updateHeader()` - Update header based on current screen
  - `updateWelcomeScreen()` - Update welcome screen translations

### CSS Classes
- **File**: `public/css/style.css`
- **Screen Classes**: `.screen`, `.screen.active`
- **FAQ Classes**: `.faq-item`, `.faq-card`, `.faq-question`, `.faq-answer`, `.faq-icon`
- **Menu Classes**: `.menu-card`, `.collapsible`, `.collapsible-content`
- **Form Classes**: `.submit-section`, `.form-field`, `.input-field`

---

## 📁 File Structure

```
public/
├── index.html          # Main HTML structure (all screens)
├── css/
│   └── style.css      # All styles including FAQ
├── js/
│   ├── app.js         # Main application logic
│   ├── translations.js # Translation system
│   └── translations/
│       ├── en.json    # English translations
│       ├── uz.json    # Uzbek translations
│       ├── ru.json    # Russian translations (includes FAQs)
│       └── tr.json    # Turkish translations
└── images/
    ├── oxbridge-logo.png
    └── placeholder.svg
```

---

## 🔍 Quick Reference

### Screen IDs
- `welcomeScreen` - Welcome/Language Selection
- `menuScreen` - Main Menu
- `campusScreen` - Campus Selection
- `dobScreen` - Date of Birth Entry
- `resultsScreen` - Results & Submission
- `thankYouScreen` - Thank You/Confirmation

### Section IDs (Collapsible)
- `includedSection` - What's included in tuition
- `campusSection` - Campuses & location
- `ibSection` - What is IB?
- `faqSection` - FAQ section

### State Variables
- `state.language` - Current language (en, uz, ru, tr)
- `state.campusPreference` - Selected campus (MU, YASH, BOTH)
- `state.children` - Array of child data
- `state.navigationHistory` - Navigation stack

---

## 📝 Notes

- All FAQs are currently implemented in Russian only
- Translation system loads only the selected language
- FAQ accordions close other FAQs when opened
- Navigation history tracks back button functionality
- All screens update translations when language changes

---

**Last Updated**: 2025
**Version**: 1.0

