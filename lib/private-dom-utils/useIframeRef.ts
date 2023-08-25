import { useMemo, useRef } from "react";

export const useIframeRef = () => {
  const ref = useRef<HTMLIFrameElement>(null);

  return useMemo(() => {
    const getIframeElement = () => {
      const element = ref.current;

      if (!element) {
        throw new Error(
          "Iframe element not found." +
            " Did forget to pass the ref to the iframe element?",
        );
      }

      return element;
    };

    return {
      getIframeElement,
      ref,
    };
  }, []);
};
