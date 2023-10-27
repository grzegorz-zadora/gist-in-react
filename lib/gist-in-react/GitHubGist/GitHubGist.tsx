import { CSSProperties, ReactNode } from "react";
import { useGitHubGist } from "./useGithubGist";
import { OnLoadGistContent } from "./OnLoadGistContent";
import { Resizing } from "./types";
import { useIframeStyle } from "./useIframeStyle";

export const GitHubGist = ({
  title,
  resizing,
  className,
  style = defaultStyle,
  Loader,
  gistSource,
  onLoadGistContent,
}: Props) => {
  const githubGist = useGitHubGist({
    gistSource,
    resizing,
  });

  const iframeStyle = useIframeStyle({
    status: githubGist.status,
    width: githubGist.iframeWidth,
    height: githubGist.iframeHeight,
    derivedStyle: style,
    resizing,
  });

  return (
    <>
      {onLoadGistContent !== undefined && (
        <OnLoadGistContent
          status={githubGist.status}
          iframeRef={githubGist.iframeRef}
          onLoadGistContent={onLoadGistContent}
        />
      )}
      <iframe
        ref={githubGist.iframeRef.ref}
        className={className}
        style={iframeStyle}
        title={title}
      />
      {githubGist.status === "pending" && Loader && <Loader />}
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
  resizing: Resizing;
  Loader?: () => ReactNode;
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
