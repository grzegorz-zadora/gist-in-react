"use client";

import { GitHubGist } from "react-embed-code/GitHubGist";
import { Spinner } from "../../../common/Spinner";

const Page = () => (
  <>
    <h1>Auto adjust to the width of the gist's content</h1>
    <GitHubGist
      title="Example code"
      resizing="autoAdjustWidthOnMount"
      loader={<Spinner />}
      gistSource={`<script src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js"></script>`}
    />
  </>
);

export default Page;
