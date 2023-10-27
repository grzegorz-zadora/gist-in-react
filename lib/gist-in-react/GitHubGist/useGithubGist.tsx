import { useCallback, useEffect, useMemo, useState } from "react";
import { getScriptSource } from "./getScriptSource";
import { logger } from "logger";
import { CssSize, Resizing, Status } from "./types";
import { getResizer } from "./resizers";
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

  const [iframeWidth, setIframeWidth] = useState<CssSize>();

  const [iframeHeight, setIframeHeight] = useState<CssSize>();

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
          value: "margin:0px;height:100%",
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

      const resize = getResizer(resizing);

      if (!resize) {
        return logger.error(`Unsupported resizing value: "${resizing}".`);
      }

      const { width, height } = resize(iframeDocument.documentElement);

      setIframeWidth(width);
      setIframeHeight(height);
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
      status,
      iframeHeight,
      iframeWidth,
    }),
    [iframeHeight, iframeRef, iframeWidth, status],
  );
};

type Props = {
  resizing: Resizing;
  /**
   * A gist's embed code (`<script src="...`) or a gist's URL (`https://gist.github.com/{{username}}/{{gist-id}}`)
   */
  gistSource: string;
};
