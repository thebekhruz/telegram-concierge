// Dynamic Translation Loader
// Only loads the selected language to optimize performance

// Initialize translations object
window.translations = window.translations || {};

// Track which languages are loaded
const loadedLanguages = new Set();

// Default fallback language (always loaded)
const DEFAULT_LANG = 'ru';

/**
 * Load a language translation file dynamically
 * @param {string} lang - Language code (en, ru, uz, tr)
 * @returns {Promise<void>}
 */
function loadLanguage(lang) {
    return new Promise((resolve, reject) => {
        // If already loaded, resolve immediately
        if (loadedLanguages.has(lang) && window.translations[lang]) {
            resolve();
            return;
        }

        // Check if language is valid
        if (!['en', 'ru', 'uz', 'tr'].includes(lang)) {
            console.warn(`Invalid language code: ${lang}, falling back to ${DEFAULT_LANG}`);
            lang = DEFAULT_LANG;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `./js/translations/${lang}.js`;
        script.async = true;
        
        script.onload = () => {
            loadedLanguages.add(lang);
            console.log(`✓ Language "${lang}" loaded successfully`);
            resolve();
        };
        
        script.onerror = () => {
            console.error(`✗ Failed to load language "${lang}"`);
            // Fallback to default language if loading fails
            if (lang !== DEFAULT_LANG) {
                loadLanguage(DEFAULT_LANG).then(resolve).catch(reject);
            } else {
                reject(new Error(`Failed to load language: ${lang}`));
            }
        };
        
        // Append to head
        document.head.appendChild(script);
    });
}

/**
 * Translation function
 * Safe to call even before translations are loaded
 * @param {string} key - Translation key
 * @param {string} lang - Language code (default: 'en')
 * @returns {string} Translated text or key if not found
 */
function t(key, lang = DEFAULT_LANG) {
    // If translations for this language are not loaded yet, return key
    if (!window.translations[lang]) {
        // Try to load it (async, but return immediately)
        if (!loadedLanguages.has(lang)) {
            loadLanguage(lang).catch(err => {
                console.error('Error loading language:', err);
            });
        }
        // Return key as fallback
        return key;
    }
    
    // Return translation or fallback to English, or key itself
    return window.translations[lang]?.[key] 
        || window.translations[DEFAULT_LANG]?.[key] 
        || key;
}

// Load default language immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadLanguage(DEFAULT_LANG).catch(err => {
            console.error('Failed to load default language:', err);
        });
    });
} else {
    // DOM already loaded
    loadLanguage(DEFAULT_LANG).catch(err => {
        console.error('Failed to load default language:', err);
    });
}

// Export functions to global scope
window.loadLanguage = loadLanguage;
window.t = t;
