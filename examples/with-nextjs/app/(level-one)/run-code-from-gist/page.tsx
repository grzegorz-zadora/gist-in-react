"use client";

import { GitHubGist } from "gist-in-react/GitHubGist";
import { Spinner } from "../../../common/Spinner";

const Page = () => (
  <>
    <h1>Run JavaScript code from a gist</h1>
    <GitHubGist
      title="Example code"
      resizing="autoAdjustHeightOnMount"
      loader={<Spinner />}
      gistSource="https://gist.github.com/grzegorz-zadora/8e2687997b58a5dc9d2154ae9159b880"
      onLoadGistContent={eval}
    />
  </>
);

export default Page;
