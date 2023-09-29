import { CSSProperties, useEffect, useState } from "react";
import { useIframeRef } from "private-dom-utils/useIframeRef";
import { installScriptToIframe } from "private-dom-utils/installScriptToIframe";
import { getIframeDocument } from "private-dom-utils/getIframeDocument";
import { getScriptSource } from "./getScriptSource";

export const GitHubGist = ({
  title,
  resizing,
  className,
  style = defaultStyle,
  loader,
  gistSource,
  onLoadGistContent,
}: Props) => {
  if (resizing !== "autoAdjustHeightOnMount") {
    throw new Error("Only autoAdjustHeightOnMount is supported");
  }

  const iframeRef = useIframeRef();

  const [status, setStatus] = useState<"pending" | "resolved" | "rejected">(
    "pending",
  );

  const [iframeHeightPx, setIframeHeightPx] = useState(0);

  useEffect(() => {
    const iframe = iframeRef.getIframeElement();

    const load = async () => {
      const scriptSourceResult = getScriptSource(gistSource);

      if ("error" in scriptSourceResult) {
        logError(scriptSourceResult.error);
        return;
      }

      const { scriptSource } = scriptSourceResult;

      await installScriptToIframe({
        scriptSource,
        iframe,
      });

      logDebug("script installed");

      const iframeDocument = getIframeDocument(iframe);

      iframeDocument.body.setAttribute("style", "margin: 0px");

      logDebug("style reset");

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

      setIframeHeightPx(iframeDocument.documentElement.scrollHeight);

      logDebug("iframe height set");
    };

    logDebug("iframe load started...");

    void load()
      .then(() => {
        logDebug("iframe load finished");
        return setStatus("resolved");
      })
      .catch(() => {
        logDebug("iframe load failed");
        return setStatus("rejected");
      });
  }, [gistSource, iframeRef]);

  useEffect(() => {
    logDebug({ iframeHeightPx });
  }, [iframeHeightPx]);

  useEffect(() => {
    if (onLoadGistContent === undefined || status !== "resolved") {
      logDebug("Skipping onLoadGistContent");
      return;
    }

    logDebug("Firing onLoadGistContent");

    const iframe = iframeRef.getIframeElement();
    const iframeDocument = getIframeDocument(iframe);

    const gistDataElement = [
      ...iframeDocument.getElementsByClassName("gist-data"),
    ].at(0);

    if (!gistDataElement) {
      logError('Cannot find element with class="gist-data"');
      return;
    }

    onLoadGistContent(gistDataElement.textContent ?? "");
  }, [iframeRef, onLoadGistContent, status]);

  return (
    <>
      <iframe
        ref={iframeRef.ref}
        className={className}
        style={{
          height: iframeHeightPx,
          visibility: status === "pending" ? "hidden" : "visible",
          position: status === "pending" ? "absolute" : "static",
          ...style,
        }}
        title={title}
      />
      {status === "pending" && loader}
    </>
  );
};

const defaultStyle = {
  border: 0,
  padding: 0,
};

type Props = {
  className?: string;
  style?: CSSProperties;
  /** [Iframe must have a unique title property](https://www.w3.org/WAI/WCAG21/Techniques/html/H64) */
  title: string;
  /**
   * - `autoAdjustHeightOnMount` - will automatically adjust the height of the
   * `<iframe />` to make it equal to the gist's height. However, until
   * `<iframe />` is loaded it will have 0px height.
   * - `fill` - will adjust the size of the `<iframe />` to cover its container
   * - `none` - will not apply any adjustments to the `<iframe />`
   * (default behavior)
   * - `{ ratio: number}` - `<iframe />` will have 100% width of its container
   * and then the height of the `<iframe />` will be adjusted to satisfy the
   * ratio
   */
  resizing:
    | "autoAdjustHeightOnMount"
    | "fill"
    | "none"
    | {
        ratio: number;
      };
  loader?: JSX.Element;
  /**
   * A gist's embed code (`<script src="...`) or a gist's URL (`https://gist.github.com/{{username}}/{{gist-id}}`)
   */
  gistSource: string;
  /**
   * Once a gist is loaded the provided callback will be fired with the gist's
   * content as a raw string. You can use that to run the code inside the
   * gist for instance.
   */
  onLoadGistContent?: (gistContent: string) => void;
};

const mountTimeoutMs = 30000;

let timestamp: number | null = null;

const logError = (...messages: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(`[ react-embed-code ]`, ...messages);
  }
};

const logDebug = (...messages: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    const lastTimestamp = timestamp ?? Date.now();
    timestamp = Date.now();
    const diff = Math.min(999, timestamp - lastTimestamp);

    // Formatted allows for max of 3 digits
    const formatedDiff = "00".concat(String(diff)).slice(-3);

    // eslint-disable-next-line no-console
    console.debug(`[ react-embed-code ] [ ${formatedDiff}ms ]`, ...messages);
  }
};
