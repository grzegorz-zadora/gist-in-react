import { useEffect } from "react";
import { getIframeDocument } from "../shared/dom-utils";
import { logger } from "../shared/logger";

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
    const gistContent = getGistContent(iframeDocument);
    onLoadGistContent(gistContent);
  }, [iframeRef, onLoadGistContent, status]);

  return null;
};

const getGistContent = (document: Document) => {
  const gistDataElement = [...document.getElementsByClassName("gist-data")].at(
    0,
  );

  if (!gistDataElement) {
    logger.error('Cannot find element with class="gist-data"');
    return "";
  }

  return gistDataElement.textContent ?? "";
};

type Props = {
  onLoadGistContent: (gistContent: string) => void;
  status: "pending" | "resolved" | "rejected";
  iframeRef: {
    getIframeElement: () => HTMLIFrameElement;
    ref: React.RefObject<HTMLIFrameElement>;
  };
};
