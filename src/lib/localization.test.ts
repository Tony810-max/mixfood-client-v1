import { afterEach, describe, expect, it } from 'vitest';
import { translateUi, getUiLocale } from './localization';
import { translations } from '@/constants/translations';
import { uiCopy } from '@/constants/ui-copy';

afterEach(() => { document.cookie = 'lang=;max-age=0;path=/'; document.documentElement.lang = 'en'; });
describe('English and Vietnamese copy', () => {
  it('keeps the same translation keys and interpolation fields', () => {
    expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.vn).sort());
    const fields = (text: string) => [...text.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort();
    for (const key of Object.keys(translations.en) as (keyof typeof translations.en)[]) {
      expect(fields(translations.en[key]), key).toEqual(fields(translations.vn[key]));
    }
    for (const [en, vn] of Object.entries(uiCopy)) expect(fields(en), en).toEqual(fields(vn));
  });
  it('translates both source languages and preserves unknown user content', () => {
    expect(translateUi('Part-time', 'vn')).toBe('Bán thời gian');
    expect(translateUi('Bán thời gian', 'en')).toBe('Part-time');
    expect(translateUi('Customer-provided notes', 'vn')).toBe('Customer-provided notes');
    expect(translateUi('Email is required', 'vn')).toBe('Vui lòng nhập email');
  });
  it('localizes dynamic validation messages without losing values', () => {
    expect(translateUi('Giờ đặt bàn phải trong khung 09:00 - 21:50 và trước ít nhất 30 phút', 'en'))
      .toBe('Reservation time must be between 09:00 and 21:50, and at least 30 minutes from now');
  });
  it('uses the selected language for dates and numbers', () => {
    document.cookie = 'lang=vn;path=/'; expect(getUiLocale()).toBe('vi-VN');
    document.cookie = 'lang=en;path=/'; expect(getUiLocale()).toBe('en-US');
  });
});
