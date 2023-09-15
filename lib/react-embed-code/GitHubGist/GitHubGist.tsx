import { CSSProperties, useEffect, useState } from "react";
import { useIframeRef } from "private-dom-utils/useIframeRef";
import { installScriptToIframe } from "private-dom-utils/installScriptToIframe";
import { getIframeDocument } from "private-dom-utils/getIframeDocument";

export const GitHubGist = ({
  title,
  resizing,
  className,
  style = defaultStyle,
  loader,
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
      await installScriptToIframe({
        scriptSource:
          "https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js",
        iframe,
      });

      logger("script installed");

      const iframeDocument = getIframeDocument(iframe);

      iframeDocument.body.setAttribute("style", "margin: 0px");

      logger("style reset");

      const linkElements = [...iframeDocument.querySelectorAll("link")];

      const linksElementsLoading = linkElements.map(
        (linkElement) =>
          new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(
              () =>
                reject(new Error("Cannot load GithubGist in reasonable time")),
              reasonableTime,
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
      logger("iframe height set");
    };

    logger("iframe load started...");
    void load()
      .then(() => {
        logger("iframe load finished");
        return setStatus("resolved");
      })
      .catch(() => {
        logger("iframe load failed");
        return setStatus("rejected");
      });
  }, [iframeRef]);

  useEffect(() => {
    logger({ iframeHeightPx });
  }, [iframeHeightPx]);

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
};

const reasonableTime = 30000;

let timestamp: number | null = null;

const logger = (...messages: unknown[]) => {
  if (process.env.NODE_ENV === "development") {
    const lastTimestamp = timestamp ?? Date.now();
    timestamp = Date.now();
    const diff = Math.min(999, timestamp - lastTimestamp);
    // eslint-disable-next-line no-console
    console.debug(
      `[ react-embed-code ] [ ${"00".concat(String(diff)).slice(-3)}ms ]`,
      ...messages,
    );
  }
};
