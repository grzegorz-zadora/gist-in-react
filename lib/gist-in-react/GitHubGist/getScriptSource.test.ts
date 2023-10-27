import { getScriptSource } from "./getScriptSource";

test.each([
  {
    gistSource: `
  <script src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js"></script>
  `,
  },
  {
    gistSource: `<script src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js" />`,
  },
  {
    gistSource: `<script data-other="" async defer src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js" />`,
  },
])(`returns script source for gist source: "$gistSource"`, ({ gistSource }) => {
  expect(getScriptSource(gistSource)).toStrictEqual({
    scriptSource:
      "https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js",
  });
});

test.each([
  {
    gistSource: ``,
  },
  {
    gistSource: `ftp://`,
  },
  {
    gistSource: `gist.github.com/test/123`,
  },
  {
    gistSource: `https//gist.github.com/test/123`,
  },
  {
    gistSource: `https://github.com/test/123`,
  },
])(
  `returns error about invalid gist source for: "$gistSource"`,
  ({ gistSource }) => {
    expect(getScriptSource(gistSource)).toStrictEqual({
      error: expect.stringMatching(/Invalid "gistSource"/),
    });
  },
);

test.each([
  {
    gistSource: `
  <script></script>
  `,
  },
  {
    gistSource: `<script data-other="" async />`,
  },
  {
    gistSource: `<script />`,
  },
])(
  `returns error about missing "src" attribute for gist source: "$gistSource"`,
  ({ gistSource }) => {
    expect(getScriptSource(gistSource)).toStrictEqual({
      error: expect.stringMatching(
        /Missing "src" attribute in script tag in gistSource:/,
      ),
    });
  },
);

test.each([
  {
    gistSource: `<script src="https://github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js"></script>`,
  },
  {
    gistSource: `<script src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355"></script>`,
  },
  {
    gistSource: `<script src="https://gist.github.com/97a7b89b14fe7194c7d0669445ff7355.js"></script>`,
  },
])(
  `returns error about invalid URL in "src" attribute for gist source:` +
    ` "$gistSource"`,
  ({ gistSource }) => {
    expect(getScriptSource(gistSource)).toStrictEqual({
      error: expect.stringMatching(
        /Invalid URL in "src" attribute in script tag in gistSource:/,
      ),
    });
  },
);

test.each([
  {
    gistSource: `<scriptd src="https://gist.github.com/grzegorz-zadora/97a7b89b14fe7194c7d0669445ff7355.js"></script>`,
  },
])(
  `returns error about missing "src" attribute for gist source: "$gistSource"`,
  ({ gistSource }) => {
    expect(getScriptSource(gistSource)).toStrictEqual({
      error: expect.stringMatching(/Invalid script tag in gistSource:/),
    });
  },
);
