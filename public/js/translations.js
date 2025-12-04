// Translation system - loads only the selected language
let translations = null;
let currentLanguage = 'en';

/**
 * Load translations for a specific language
 * @param {string} lang - Language code (en, uz, ru, tr)
 * @returns {Promise<Object>} Translation object
 */
async function loadTranslations(lang) {
    if (translations && currentLanguage === lang) {
        return translations;
    }

    try {
        const response = await fetch(`/js/translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        translations = await response.json();
        currentLanguage = lang;
        return translations;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if selected language fails
        if (lang !== 'en') {
            return loadTranslations('en');
        }
        throw error;
    }
}

/**
 * Get a translation value by key path
 * @param {string} keyPath - Dot-separated key path (e.g., 'welcome.title')
 * @param {Object} params - Optional parameters to replace in the translation
 * @returns {string} Translated text
 */
function t(keyPath, params = {}) {
    if (!translations) {
        console.warn('Translations not loaded yet');
        return keyPath;
    }

    const keys = keyPath.split('.');
    let value = translations;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            console.warn(`Translation key not found: ${keyPath}`);
            return keyPath;
        }
    }

    if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${keyPath}`);
        return keyPath;
    }

    // Replace parameters like {age}, {period}, etc.
    let result = value;
    Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });

    return result;
}

/**
 * Update all elements with data-i18n attributes
 */
function updateTranslations() {
    if (!translations) {
        console.warn('Translations not loaded yet');
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = t(key);
        
        if (element.tagName === 'INPUT') {
            if (element.type === 'submit' || element.type === 'button') {
                element.value = text;
            } else {
                // For text inputs, update placeholder
                element.placeholder = text;
            }
        } else if (element.tagName === 'LABEL' && element.querySelector('input[type="checkbox"], input[type="radio"]')) {
            // For labels with checkboxes/radios, update the span inside
            const span = element.querySelector('span');
            if (span) {
                span.textContent = text;
            } else {
                element.textContent = text;
            }
        } else {
            element.textContent = text;
        }
    });

    // Update elements with data-i18n-html for HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const text = t(key);
        element.innerHTML = text;
    });
}

// Export for use in other scripts
window.translations = {
    load: loadTranslations,
    t: t,
    update: updateTranslations,
    getCurrentLanguage: () => currentLanguage
};

