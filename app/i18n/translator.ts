import { Application } from '@nativescript/core';
import { translations } from './translations';

export function registerTranslator() {
    // Get the device language or default to English
    const deviceLanguage = Application.systemLanguage().split('-')[0];
    const defaultLanguage = translations[deviceLanguage] ? deviceLanguage : 'en';
    
    // Store the current language
    let currentLanguage = defaultLanguage;
    
    // Register the translate filter
    Application.getResources().translate = (key: string) => {
        // Split the key by dots to navigate the translations object
        const parts = key.split('.');
        let result = translations[currentLanguage];
        
        // Navigate through the parts to find the translation
        for (const part of parts) {
            if (result && result[part]) {
                result = result[part];
            } else {
                // If translation not found, return the key
                return key;
            }
        }
        
        return result;
    };
    
    // Function to change the language
    Application.getResources().setLanguage = (lang: string) => {
        if (translations[lang]) {
            currentLanguage = lang;
        }
    };
}