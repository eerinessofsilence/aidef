export const CONTACT_MODAL_EVENT = "open-contact-modal";

export const dispatchOpenContactModal = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(CONTACT_MODAL_EVENT));
};
