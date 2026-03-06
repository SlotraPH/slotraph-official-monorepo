import en from './translations/en.json';
import tl from './translations/tl.json';

export type Locale = 'en' | 'tl';
export type TranslationKey = keyof typeof en;

const translations: Record<Locale, typeof en> = { en, tl: tl as typeof en };

export function useTranslations(locale: Locale) {
    return function t(key: TranslationKey): string {
        return translations[locale][key] ?? translations.en[key];
    };
}
