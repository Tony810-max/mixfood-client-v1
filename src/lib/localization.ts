import { uiCopy } from '@/constants/ui-copy';
import { translations } from '@/constants/translations';

export type UiLanguage = 'en' | 'vn';
const pairs = [...Object.entries(uiCopy), ...Object.keys(translations.en).map((key) => [translations.en[key as keyof typeof translations.en], translations.vn[key as keyof typeof translations.en]])];
const bySource = new Map(pairs.flatMap(([en, vn]) => [[en, { en, vn }], [vn, { en, vn }]] as const));
const templates = pairs.flatMap(([en, vn]) => [en, vn].filter((source) => /\{\w+\}/.test(source)).map((source) => {
  const names = [...source.matchAll(/\{(\w+)\}/g)].map((match) => match[1]);
  const pattern = source.split(/\{\w+\}/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)');
  return { pattern: new RegExp(`^${pattern}$`), names, en, vn };
}));
export function getUiLanguage(): UiLanguage {
  if (typeof document !== 'undefined') {
    const cookie = document.cookie.match(/(?:^|;\s*)lang=(vn|vi|en)(?:;|$)/)?.[1];
    if (cookie) return cookie === 'en' ? 'en' : 'vn';
    return document.documentElement.lang === 'vi' ? 'vn' : 'en';
  }
  return 'en';
}
export function translateUi(source: string, language = getUiLanguage(), values?: Record<string, string | number>): string {
  let text = bySource.get(source)?.[language];
  let replacements = values;
  if (!text) {
    for (const template of templates) {
      const match = source.match(template.pattern);
      if (match) { text = template[language]; replacements = { ...Object.fromEntries(template.names.map((name, index) => [name, match[index + 1]])), ...values }; break; }
    }
  }
  return Object.entries(replacements ?? {}).reduce((result, [key, value]) => result.split(`{${key}}`).join(String(value)), text ?? source);
}
export const getUiLocale = () => getUiLanguage() === 'vn' ? 'vi-VN' : 'en-US';
