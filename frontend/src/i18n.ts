import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import deCommon from "./locales/de/common.json";
import skCommon from "./locales/sk/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import itCommon from "./locales/it/common.json";

export const SUPPORTED_LANGUAGES = [
  "en",
  "de",
  "sk",
  "es",
  "fr",
  "it",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const isSupportedLanguage = (
  value?: string,
): value is SupportedLanguage =>
  SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

export const resolveLanguage = (value?: string): SupportedLanguage =>
  isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;

export const buildLocalizedPath = (lng: SupportedLanguage, path: string) => {
  if (!path.startsWith("/")) return path;
  if (path === "/") return `/${lng}`;
  return `/${lng}${path}`;
};

export const replaceLanguageInPath = (
  pathname: string,
  nextLng: SupportedLanguage,
) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${nextLng}`;
  const nextSegments = [...segments];
  nextSegments[0] = nextLng;
  return `/${nextSegments.join("/")}`;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    de: { common: deCommon },
    sk: { common: skCommon },
    es: { common: esCommon },
    fr: { common: frCommon },
    it: { common: itCommon },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
