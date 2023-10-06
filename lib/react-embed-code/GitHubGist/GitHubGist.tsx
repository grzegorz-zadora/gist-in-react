import { CSSProperties } from "react";
import { useGitHubGist } from "./useGithubGist";
import { OnLoadGistContent } from "./OnLoadGistContent";
import { Resizing } from "./types";

export const GitHubGist = ({
  title,
  resizing,
  className,
  style = defaultStyle,
  loader,
  gistSource,
  onLoadGistContent,
}: Props) => {
  if (
    resizing !== "autoAdjustHeightOnMount" &&
    resizing !== "autoAdjustWidthAndHeightOnMount" &&
    resizing !== "autoAdjustWidthOnMount"
  ) {
    throw new Error("Unsupported resizing");
  }

  const githubGist = useGitHubGist({
    gistSource,
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
        style={{
          ...githubGist.style,
          ...style,
        }}
        title={title}
      />
      {githubGist.status === "pending" && loader}
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
