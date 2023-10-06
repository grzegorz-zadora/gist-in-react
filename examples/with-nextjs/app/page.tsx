"use client";

import Link from "next/link";

const Page = () => (
  <>
    <h1>Examples</h1>
    <nav>
      <ul>
        <li>
          <Link href="/auto-adjust-height-on-mount">
            Auto adjust to the height of the gist's content
          </Link>
        </li>
        <li>
          <Link href="/auto-adjust-height-and-width-on-mount">
            Auto adjust to the height and width of the gist's content
          </Link>
        </li>
        <li>
          <Link href="/auto-adjust-width-on-mount">
            Auto adjust to the width of the gist's content
          </Link>
        </li>
        <li>
          <Link href="/run-code-from-gist">
            Run JavaScript code from a gist
          </Link>
        </li>
      </ul>
    </nav>
  </>
);

export default Page;
