import { getIframeDocument } from "./getIframeDocument";

/**
 * This method supports only single script per iframe, since the script may
 * use `document.write`.
 *
 * When you install such script in an iframe, the existing content will be
 * deleted to make `document.write` work.
 */
export const installScriptToIframe = ({
  scriptSource,
  iframe,
}: {
  scriptSource: string;
  iframe: HTMLIFrameElement;
}) => {
  const iframeDocument = getIframeDocument(iframe);

  return new Promise<Event>((resolve, reject) => {
    const element = document.createElement("script");
    element.src = scriptSource;

    iframeDocument.head.append(element);

    iframeDocument.open();

    element.addEventListener("load", resolve);
    element.addEventListener("error", reject);
  }).finally(() => iframeDocument.close);
};
