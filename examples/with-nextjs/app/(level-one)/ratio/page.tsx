"use client";

import { GitHubGist } from "gist-in-react/GitHubGist";
import { Spinner } from "../../../common/Spinner";

const Page = () => {
  return (
    <>
      <h1>Aspect ratio</h1>
      <h2>
        The iframe will always have 16/9 aspect ratio, filling its container
        width.
      </h2>
      <GitHubGist
        title="Example code"
        resizing={`ratio:${16 / 9}`}
        loader={<Spinner />}
        gistSource={`<script src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js"></script>`}
      />
    </>
  );
};

export default Page;
