# gist-in-react

## Description

`gist-in-react` is a library designed to simplify the process of embedding GitHub gists into static websites or single-page applications (SPAs), within a React environment. Traditionally, embedding GitHub gists can be cumbersome, requiring the use of `<script />` tags, which may not seamlessly integrate with React applications and website layouts. This package streamlines the embedding process, enabling you to effortlessly adjust code snippets to your website's design.

## Installation

You can easily install `gist-in-react` using npm:

```bash
npm install gist-in-react
```

## Usage

### Import the Component

Import the `GitHubGist` component into your React application:

```tsx
import { GitHubGist } from "gist-in-react/GitHubGist";
```

### Embed a GitHub Gist

Use the `GitHubGist` component within your application to embed a GitHub gist. As a source you can use:

- gist's url`https://gist.github.com/{user}/{gist-id}`
- gist embed code like `<script src="https://gist.github.com/{user}/{gist-id}.js"></script>`

```tsx
    const Loader = () => <>wait...</>

    <GitHubGist
      title="Example code"
      resizing="autoAdjustWidthAndHeightOnMount"
      Loader={Loader}
      gistSource={`<script src="https://gist.github.com/{user}/{gist-id}.js"></script>`}
    />
```

### Customize the Appearance

You can customize the appearance of the embedded gist by passing props to the `GitHubGist` component:

- `resizing` - how the gist will interact with the page's layout
  - `autoAdjustHeightOnMount` - the rendered gist will have 100% it's intrinsic height
  - `autoAdjustWidthAndHeightOnMount` - the rendered gist will have 100% it's intrinsic height and width
  - `autoAdjustWidthOnMount` - the rendered gist will have 100% it's intrinsic width
  - `fill` - the gist will have absolute position and will fill it's container. You should use `position: relative` in the container's styles.
  - `none`
  - `ratio:${number}` - the gist will keep the provided aspect ratio while maintaining 100% width of its container
- `loader` - will be rendered until the gist loads

---

Simplify GitHub gist embedding in your React applications with `gist-in-react`.