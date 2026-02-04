declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

const isGtmEnabled = () =>
  import.meta.env.PROD && Boolean(import.meta.env.VITE_GTM_ID);

export function gtmPush(payload: Record<string, any>) {
  if (!isGtmEnabled()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function gtmPageView(page_path: string) {
  gtmPush({
    event: "page_view",
    page_path,
    page_title: document.title,
  });
}
