import { useEffect } from "react";
import { getIframeDocument } from "private-dom-utils/getIframeDocument";
import { logger } from "logger";

export const OnLoadGistContent = ({
  onLoadGistContent,
  iframeRef,
  status,
}: Props) => {
  useEffect(() => {
    if (onLoadGistContent === undefined || status !== "resolved") {
      logger.debug("Skipping onLoadGistContent");
      return;
    }

    logger.debug("Firing onLoadGistContent");

    const iframe = iframeRef.getIframeElement();
    const iframeDocument = getIframeDocument(iframe);

    const gistDataElement = [
      ...iframeDocument.getElementsByClassName("gist-data"),
    ].at(0);

    if (!gistDataElement) {
      logger.error('Cannot find element with class="gist-data"');
      return;
    }

    onLoadGistContent(gistDataElement.textContent ?? "");
  }, [iframeRef, onLoadGistContent, status]);

  return null;
};

type Props = {
  onLoadGistContent: (gistContent: string) => void;
  status: "pending" | "resolved" | "rejected";
  iframeRef: {
    getIframeElement: () => HTMLIFrameElement;
    ref: React.RefObject<HTMLIFrameElement>;
  };
};
