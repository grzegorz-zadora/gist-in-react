import { useCallback, useEffect, useId, useRef } from "react";

export const GitHubGist = () => {
  const id = useId();
  const ref = useRef<HTMLIFrameElement>(null);

  const getIframeElement = useCallback(() => {
    const element = ref.current;
    if (!element) {
      throw new Error("element not found");
    }
    return element;
  }, []);

  const getIframeDocument = useCallback(() => {
    const { contentDocument } = getIframeElement();
    if (!contentDocument) {
      throw new Error("contentDocument not found");
    }
    return contentDocument;
  }, [getIframeElement]);

  useEffect(() => {
    const iframeDocument = getIframeDocument();

    iframeDocument.body.innerHTML =
      '<script src="https://gist.github.com/grzegorz-zadora/9676931de44a03cce55fd4aeba589ccd.js" type="text/javascript"></script>';
  }, [getIframeDocument]);

  return (
    <iframe
      ref={ref}
      title={`Gist Iframe ${id}`}
      style={{
        border: 0,
      }}
    />
  );
};
