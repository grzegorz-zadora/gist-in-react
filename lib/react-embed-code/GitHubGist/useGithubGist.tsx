import { useCallback, useEffect, useMemo, useState } from "react";
import { getScriptSource } from "./getScriptSource";
import { logger } from "logger";
import { Resizing, Status } from "./types";
import { getKeys, includes } from "safe";
import { resizers } from "./resizers";
import {
  useIframeRef,
  waitForAllElementsToLoad,
  setAttributeInAll,
  installScriptToIframe,
  getIframeDocument,
} from "private-dom-utils";

export const useGitHubGist = ({ resizing, gistSource }: Props) => {
  const iframeRef = useIframeRef();

  const [status, setStatus] = useState<Status>("pending");

  const [iframeWidthPx, setIframeWidthPx] = useState<number | undefined>();

  const [iframeHeightPx, setIframeHeightPx] = useState<number | undefined>();

  const loadIframe = useCallback(
    async (iframe: HTMLIFrameElement) => {
      const scriptSourceResult = getScriptSource(gistSource);

      if ("error" in scriptSourceResult) {
        logger.error(scriptSourceResult.error);
        return;
      }

      const { scriptSource } = scriptSourceResult;

      await installScriptToIframe({
        scriptSource,
        iframe,
      });

      logger.debug("script installed");

      const iframeDocument = getIframeDocument(iframe);

      setAttributeInAll({
        document: iframeDocument,
        selector: "body",
        attribute: {
          name: "style",
          value: "margin: 0px",
        },
      });

      setAttributeInAll({
        document: iframeDocument,
        selector: "a",
        attribute: {
          name: "target",
          value: "_blank",
        },
      });

      logger.debug("waiting for all <link> elements to load...");
      await waitForAllElementsToLoad(iframeDocument, "link");
      logger.debug("all <link> elements loaded");

      // TODO: remove this once all resizings are supported
      if (!includes(getKeys(resizers), resizing)) {
        logger.error(
          `Unsupported resizing "${resizing}" prop. Only ${getKeys(
            resizers,
          ).join(",")} are supported`,
        );
        return;
      }

      const resize = resizers[resizing];

      const { widthPx, heightPx } = resize(iframeDocument.documentElement);

      setIframeWidthPx(widthPx);
      setIframeHeightPx(heightPx);
    },
    [gistSource, resizing],
  );

  useEffect(() => {
    const handleLoadIframe = async () => {
      const iframe = iframeRef.getIframeElement();
      logger.debug("iframe load started...");

      try {
        await loadIframe(iframe);
        logger.debug("iframe load finished");
        return setStatus("resolved");
      } catch (error) {
        logger.debug("iframe load failed");
        logger.error(error);
        return setStatus("rejected");
      }
    };

    void handleLoadIframe();
  }, [gistSource, iframeRef, loadIframe, resizing]);

  return useMemo(
    () => ({
      iframeRef,
      style: {
        boxSizing: "border-box",
        height: iframeHeightPx,
        width: iframeWidthPx,
        visibility: status === "pending" ? "hidden" : "visible",
        position: status === "pending" ? "absolute" : "static",
      } as const,
      status,
    }),
    [iframeHeightPx, iframeRef, iframeWidthPx, status],
  );
};

type Props = {
  resizing: Resizing;
  /**
   * A gist's embed code (`<script src="...`) or a gist's URL (`https://gist.github.com/{{username}}/{{gist-id}}`)
   */
  gistSource: string;
};
