export const COOKIE_CONSENT_STORAGE_KEY = "aidef-cookie-consent";
export const COOKIE_CONSENT_EVENT = "aidef-cookie-consent-change";

export type CookieConsentValue = "accepted" | "declined";

export function getStoredCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return storedValue === "accepted" || storedValue === "declined"
      ? storedValue
      : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return getStoredCookieConsent() === "accepted";
}

export function persistCookieConsent(value: CookieConsentValue) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    // Ignore storage errors and still notify listeners in memory.
  }

  window.dispatchEvent(
    new CustomEvent<CookieConsentValue>(COOKIE_CONSENT_EVENT, {
      detail: value,
    }),
  );
}
