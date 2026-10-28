import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { translations } from '@/constants/translations';
import { translateUi } from '@/lib/localization';

type Language = "en" | "vn";



const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (typeof translations)["en"];
}>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export const useLanguage = () => useContext(LanguageContext);

export const useUiText = () => {
  const { lang } = useLanguage();
  return useCallback((source: string, values?: Record<string, string | number>) => translateUi(source, lang, values), [lang]);
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = getCookie("lang");
    return saved === "vn" || saved === 'vi' ? "vn" : "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    setCookie("lang", l);
  };

  const t = translations[lang];
  useEffect(() => { document.documentElement.lang = lang === 'vn' ? 'vi' : 'en'; }, [lang]);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
