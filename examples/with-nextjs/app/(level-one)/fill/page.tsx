"use client";

import { GitHubGist } from "gist-in-react/GitHubGist";
import { Spinner } from "../../../common/Spinner";

const Page = () => (
  <>
    <h1>Fill the container</h1>
    <div
      style={{
        position: "relative",
        height: "500px",
        width: "500px",
        margin: "0 auto",
        border: "1px solid black",
        backgroundColor: "darkgray",
      }}
    >
      <span
        style={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        The iframe completely fills its container. For the purpose of this
        presentation, the iframe has a 50% opacity.
      </span>
      <GitHubGist
        title="Example code"
        resizing="fill"
        loader={<Spinner />}
        gistSource={`<script src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js"></script>`}
        style={{
          opacity: "50%",
        }}
      />
    </div>
  </>
);

export default Page;
