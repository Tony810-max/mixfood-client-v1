# English / Vietnamese audit

The source audit covers all `.ts` and `.tsx` files under client `src` and admin `app`, `components`, `lib` (331 files at the time of the change). Application dictionaries were extracted into `translations.ts`; additional shared UI copy lives in `ui-copy.ts`. Components subscribe to their existing language provider using `useUiText`, while event handlers, API errors, toasts and formatting helpers use `translateUi` with the current locale.

Reviewed surfaces include navigation, recruitment and applicant forms, table/order/payment dialogs, reservation actions, vouchers and QR scanning, website and table chat, authentication and validation, status badges, calendar controls, loading/error states, image upload, pagination, accessibility labels, reviews, social sharing, page metadata and kitchen tickets. Receipt preview initially follows the admin locale and retains its explicit print-language selector.

`pnpm lint:i18n` in either frontend checks dictionary-key parity, interpolation placeholders, unknown literal copy keys, raw JSX text and literal user-facing attributes. It deliberately allows brand names, language codes, identifiers, sample contact values and symbols. It is a static regression check, not proof that arbitrary API or dynamic content is localized. Do not translate customer names, application experience, staff messages, notes or other user-authored content. Product/category names continue to use their stored bilingual fields.

Runtime checks used mocked APIs: admin saves FULL_TIME with monthly salary and changes language; client shows that salary and available work type, updates JobPosting data, switches EN/VI and preserves applicant input. No real applications or production edits were submitted. Client tests also verify language-pair parity, field validation messages and formatting.

The backend chatbot accepts `language: en | vi | vn`. Existing requests default to Vietnamese. A migration adds English responses and English keywords for the default chatbot rules. Custom rules without English copy receive an English fallback rather than leaking Vietnamese into the English interface; fill `responseEn` when adding custom rules.

Deploy the backend migrations before publishing the updated frontends. This work does not apply production migrations, translate user-authored database content or change the language of existing email templates.
