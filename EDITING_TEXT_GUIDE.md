# How to Edit All Text in the Mini App

## Simple Text Editing

All text in the Telegram Mini App is stored in **ONE file**: `/public/js/translations.js`

### Quick Start

1. Open `/public/js/translations.js`
2. Find the text you want to change
3. Edit it
4. Save the file
5. **Done!** Changes appear immediately (refresh the app)

---

## File Structure

The translations file contains all text for all 4 languages:

```javascript
const translations = {
    en: { /* English text */ },
    ru: { /* Russian text */ },
    uz: { /* Uzbek text */ },
    tr: { /* Turkish text */ }
};
```

---

## How to Edit Text

### Example 1: Change Welcome Title

**Current:**
```javascript
en: {
    welcome_title: "Oxbridge International School",
    // ...
}
```

**Change to:**
```javascript
en: {
    welcome_title: "Welcome to Oxbridge",
    // ...
}
```

### Example 2: Edit Button Text

**Current:**
```javascript
en: {
    calculate_btn: "Calculate tuition",
    // ...
}
```

**Change to:**
```javascript
en: {
    calculate_btn: "Get Price Estimate",
    // ...
}
```

### Example 3: Update Error Messages

**Current:**
```javascript
en: {
    val_enter_dob: "Please enter date of birth for all children",
    // ...
}
```

**Change to:**
```javascript
en: {
    val_enter_dob: "Don't forget to enter birthdates for all kids!",
    // ...
}
```

---

## All Editable Content

Here's what you can customize in `/public/js/translations.js`:

### 1. Welcome Screen
- `welcome_title` - Main title
- `welcome_subtitle` - Subtitle
- `welcome_text` - Description paragraph
- `welcome_instruction` - Instruction text

### 2. Main Menu
- `menu_title` - Screen title
- `calculator_title` - Calculator button text
- `calculator_desc` - Calculator description
- `section_included_title` - "What's included" heading
- `section_campus_title` - "Campus" section heading
- `section_ib_title` - "IB" section heading

### 3. Campus Selection
- `campus_screen_title` - Screen title
- `campus_mu` - Mirzo-Ulugbek campus name
- `campus_yash` - Yashnobod campus name
- `campus_both` - "Both campuses" option
- `campus_mu_feature_1/2` - MU campus features
- `campus_yash_feature_1/2` - Yash campus features

### 4. Date of Birth Entry
- `dob_screen_title` - Screen title
- `dob_instruction` - Instructions
- `child_number` - "Child" label
- `add_child` - "Add child" button
- `remove_child` - "Remove" button
- `calculate_btn` - Calculate button

### 5. Results Display
- `results_screen_title` - Screen title
- `age_as_of` - "Age" label
- `price_from` - "from" text
- `price_per_month` - "per month" text
- `price_per_quarter` - "per quarter" text
- `price_approx` - "(approx.)" text
- `sibling_note` - Sibling discount note
- `price_disclaimer_1/2` - Disclaimer paragraphs

### 6. Submit Form
- `submit_title` - Form title
- `parent_name_label` - Name field label
- `parent_name_placeholder` - Name placeholder
- `parent_phone_label` - Phone field label
- `parent_phone_placeholder` - Phone placeholder
- `contact_method_label` - Contact method label
- `contact_telegram` - Telegram option
- `contact_call` - Call option
- `waitlist_label` - Waitlist checkbox text
- `submit_btn` - Submit button

### 7. Thank You Screen
- `thank_you_title` - Title
- `thank_you_msg_1` - First paragraph
- `thank_you_msg_2` - Second paragraph

### 8. Validation Messages
- `val_enter_dob` - Missing DOB error
- `val_enter_name` - Missing name error
- `val_enter_phone` - Missing phone error
- `val_error` - General error message

---

## Adding New Languages

### Step 1: Add Language to Translations

In `/public/js/translations.js`, add a new language block:

```javascript
const translations = {
    en: { /* existing */ },
    ru: { /* existing */ },
    uz: { /* existing */ },
    tr: { /* existing */ },
    // Add new language
    de: {
        welcome_title: "Oxbridge Internationale Schule",
        welcome_subtitle: "Zulassungsassistent",
        // ... translate all keys
    }
};
```

### Step 2: Add Language Button

In `/public/index.html`, add language button:

```html
<div class="language-buttons">
    <button class="lang-btn" onclick="selectLanguage('uz')">O'zbekcha</button>
    <button class="lang-btn" onclick="selectLanguage('ru')">Русский</button>
    <button class="lang-btn" onclick="selectLanguage('tr')">Türkçe</button>
    <button class="lang-btn" onclick="selectLanguage('en')">English</button>
    <!-- Add your new language -->
    <button class="lang-btn" onclick="selectLanguage('de')">Deutsch</button>
</div>
```

### Step 3: Add Language Display Code

In `/public/js/app.js`, update the language display mapping:

```javascript
const LANG_DISPLAY = {
    'en': 'EN',
    'uz': 'UZ',
    'ru': 'RU',
    'tr': 'TR',
    'de': 'DE'  // Add this
};
```

**Done!** Your new language is now available.

---

## Tips for Translation

### 1. Keep Keys Consistent
All languages must have the same keys:

✅ **Good:**
```javascript
en: { welcome_title: "Welcome" },
ru: { welcome_title: "Добро пожаловать" }
```

❌ **Bad:**
```javascript
en: { welcome_title: "Welcome" },
ru: { welcome_text: "Добро пожаловать" }  // Wrong key!
```

### 2. Use Consistent Formatting

If English has line breaks, match them in other languages:

```javascript
en: {
    price_disclaimer_1: "Prices are approximate.\nFinal offer may vary."
},
ru: {
    price_disclaimer_1: "Цены приблизительны.\nОкончательное предложение может отличаться."
}
```

### 3. Test All Languages

After editing:
1. Open the mini app
2. Select each language
3. Navigate through all screens
4. Check that text displays correctly

### 4. Watch for Length

Some languages are longer than others:
- German and Turkish tend to be longer
- Chinese and Japanese are typically shorter
- Test that buttons don't overflow

---

## Changing Collapsible Section Content

### Location

Collapsible sections are in `/public/index.html`

### What's Included Section

```html
<div class="collapsible-content" id="includedSection">
    <div class="info-grid">
        <div class="info-item">
            <div class="info-title" data-i18n="included_academic_title">Academic programme</div>
            <div class="info-desc" data-i18n="included_academic_desc">Full-day learning programme...</div>
        </div>
        <!-- Add more items here -->
    </div>
</div>
```

To add a new item:
```html
<div class="info-item">
    <div class="info-title">Your New Title</div>
    <div class="info-desc">Your description here</div>
</div>
```

### Campus Section

```html
<div class="collapsible-content" id="campusSection">
    <div class="campus-block">
        <img src="/images/campus-mu.jpg" alt="MU Campus" class="campus-image">
        <h4>Mirzo-Ulugbek Campus</h4>
        <ul class="campus-features">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <!-- Add more features -->
        </ul>
    </div>
</div>
```

---

## Testing Your Changes

### Method 1: Local Testing
```bash
npm run dev
# Open http://localhost:3000 in browser
```

### Method 2: Telegram Testing
1. Make changes
2. Push to server
3. Open mini app in Telegram
4. Check all languages
5. Navigate through all screens

---

## Common Edits Checklist

Before going live, verify:

- [ ] Welcome screen title and text
- [ ] All button labels
- [ ] Form field labels and placeholders
- [ ] Error messages
- [ ] Price display format
- [ ] Disclaimer text
- [ ] Thank you message
- [ ] All 4 languages match structure
- [ ] No missing translations
- [ ] Mobile display looks good
- [ ] Special characters display correctly

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| All translations | `/public/js/translations.js` |
| HTML structure | `/public/index.html` |
| Styling | `/public/css/style.css` |
| App logic | `/public/js/app.js` |

### Most Common Edits

```javascript
// Welcome message
welcome_title: "Your School Name"

// Button text
calculate_btn: "Your Button Text"

// Price display
price_from: "starting from"

// Submit button
submit_btn: "Send Request"
```

---

## Need Help?

1. **Syntax Error?** - Make sure all quotes match and commas are in place
2. **Text Not Updating?** - Clear browser cache or hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. **Missing Translation?** - Check that the key exists in all language blocks
4. **Strange Characters?** - Make sure file is saved as UTF-8

