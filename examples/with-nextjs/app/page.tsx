"use client";

import { GitHubGist } from "react-embed-code/GitHubGist";
import { Spinner } from "./Spinner";

const Page = () => (
  <>
    <h1>
      <code>resizing: autoAdjustHeightOnMount</code>
    </h1>
    <GitHubGist
      title="Example code"
      resizing="autoAdjustHeightOnMount"
      loader={<Spinner />}
    />
  </>
);

export default Page;
