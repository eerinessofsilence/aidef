import { hasAnalyticsConsent } from "../../lib/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim() ?? "";

const isGa4Enabled = () => import.meta.env.PROD && measurementId.length > 0;

let initialized = false;
let scriptScheduled = false;

function scheduleGtagScript() {
  if (!measurementId || scriptScheduled) return;
  scriptScheduled = true;

  const injectScript = () => ensureGtagScript();
  const idleWindow = window as Window & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number },
    ) => number;
  };

  const runWhenIdle = () => {
    if (typeof idleWindow.requestIdleCallback === "function") {
      idleWindow.requestIdleCallback(injectScript, { timeout: 2000 });
      return;
    }

    window.setTimeout(injectScript, 1200);
  };

  if (document.readyState === "complete") {
    runWhenIdle();
    return;
  }

  window.addEventListener("load", runWhenIdle, { once: true });
}

function ensureGtagScript() {
  if (!measurementId) return;
  if (document.querySelector(`script[data-ga4-id="${measurementId}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.ga4Id = measurementId;
  document.head.appendChild(script);
}

function gtag(...args: unknown[]) {
  window.gtag?.(...args);
}

export function initGa4() {
  if (!isGa4Enabled() || initialized || !hasAnalyticsConsent()) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer?.push(arguments);
    };

  gtag("js", new Date());
  gtag("config", measurementId, { send_page_view: false });
  scheduleGtagScript();
  initialized = true;
}

export function ga4PageView(pagePath: string) {
  if (!isGa4Enabled() || !hasAnalyticsConsent()) return;

  initGa4();
  gtag("event", "page_view", {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}
