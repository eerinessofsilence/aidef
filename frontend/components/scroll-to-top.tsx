import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Reset scroll position on every route change so navigation starts at the top.
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}
