import { useEffect, useMemo, useState } from "react";
import { useIframeRef } from "private-dom-utils/useIframeRef";
import { installScriptToIframe } from "private-dom-utils/installScriptToIframe";
import { getIframeDocument } from "private-dom-utils/getIframeDocument";
import { getScriptSource } from "./getScriptSource";
import { logger } from "logger";
import { Resizing, Status } from "./types";
import { getKeys, includes } from "safe";
import { resizers } from "./resizers";

export const useGitHubGist = ({ resizing, gistSource }: Props) => {
  const iframeRef = useIframeRef();

  const [status, setStatus] = useState<Status>("pending");

  const [iframeWidthPx, setIframeWidthPx] = useState<number | undefined>();

  const [iframeHeightPx, setIframeHeightPx] = useState<number | undefined>();

  useEffect(() => {
    const iframe = iframeRef.getIframeElement();

    const load = async () => {
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

      iframeDocument.body.setAttribute("style", "margin: 0px");

      logger.debug("style reset");

      const aElements = [...iframeDocument.querySelectorAll("a")];

      aElements.forEach((element) => element.setAttribute("target", "_blank"));

      const linkElements = [...iframeDocument.querySelectorAll("link")];

      const linksElementsLoading = linkElements.map(
        (linkElement) =>
          new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(
              () =>
                reject(new Error("Cannot load GithubGist in reasonable time")),
              mountTimeoutMs,
            );

            linkElement.addEventListener(
              "load",
              () => {
                clearTimeout(timeout);
                resolve();
              },
              {
                once: true,
              },
            );
          }),
      );

      // Wait for all linked resources to be loaded before setting the height
      await Promise.all(linksElementsLoading);

      if (!includes(getKeys(resizers), resizing)) {
        return;
      }

      const resize = resizers[resizing];

      const { widthPx, heightPx } = resize(iframeDocument.documentElement);

      setIframeWidthPx(widthPx);
      setIframeHeightPx(heightPx);
    };

    logger.debug("iframe load started...");

    void load()
      .then(() => {
        logger.debug("iframe load finished");
        return setStatus("resolved");
      })
      .catch(() => {
        logger.debug("iframe load failed");
        return setStatus("rejected");
      });
  }, [gistSource, iframeRef, resizing]);

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

const mountTimeoutMs = 30000;
