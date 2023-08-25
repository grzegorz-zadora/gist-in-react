import { CSSProperties, useEffect, useState } from "react";
import { useIframeRef } from "private-dom-utils/useIframeRef";
import { installScriptToIframe } from "private-dom-utils/installScriptToIframe";
import { getIframeDocument } from "private-dom-utils/getIframeDocument";

export const GitHubGist = ({
  title,
  resizing,
  className,
  style = {
    border: 0,
    padding: 0,
  },
}: Props) => {
  if (resizing !== "autoAdjustHeightOnMount") {
    throw new Error("Only autoAdjustHeightOnMount is supported");
  }

  const iframeRef = useIframeRef();

  const [iframeHeightPx, setIframeHeightPx] = useState(0);

  useEffect(() => {
    const iframe = iframeRef.getIframeElement();

    const load = async () => {
      await installScriptToIframe({
        scriptSource:
          "https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js",
        iframe,
      });

      const iframeDocument = getIframeDocument(iframe);

      iframeDocument.body.setAttribute("style", "margin: 0px");

      // TODO: find better way determine final height of the content of the
      // iframe. That works kind of sketchy.
      [...iframeDocument.querySelectorAll("link")].forEach((each) => {
        each.addEventListener("load", () => {
          setIframeHeightPx(iframeDocument.documentElement.scrollHeight);
        });
      });
    };

    void load();
  }, [iframeRef]);

  return (
    <iframe
      ref={iframeRef.ref}
      className={className}
      height={iframeHeightPx}
      style={style}
      title={title}
    />
  );
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
   * - `{ ratio: number}` - `<iframe />` will have 100% of its container and
   * then the height of the `<iframe />` will be adjusted to satisfy the ratio
   */
  resizing:
    | "autoAdjustHeightOnMount"
    | "fill"
    | "none"
    | {
        ratio: number;
      };
};
