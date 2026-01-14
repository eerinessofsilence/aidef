import { useCallback, useEffect, useState } from "react";

type UseInViewOnceOptions = {
  rootMargin?: string;
  threshold?: number | number[];
};

export const useInViewOnce = (options: UseInViewOnceOptions = {}) => {
  const { rootMargin = "0px 0px -10% 0px", threshold = 0 } = options;
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  const ref = useCallback((element: HTMLElement | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (inView || !node) {
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, inView, rootMargin, threshold]);

  return { ref, inView };
};
