import memoizeOne from "memoize-one";

export const getScriptSource = memoizeOne(
  (gistSource: string): GetScriptSourceResult => {
    const trimmedGistSource = gistSource.trim();

    if (trimmedGistSource.startsWith("<script")) {
      return getScriptSourceFromEmbedCode(trimmedGistSource);
    }

    if (gistScriptSrcRegExp.test(trimmedGistSource)) {
      return getScriptSourceFromGistUrl(trimmedGistSource);
    }

    return {
      error:
        'Invalid "gistSource". It should be gist\'s embed code' +
        ` (<script src="...) or  gist's url (starting with https://). Instead` +
        ` got: "${gistSource}"`,
    };
  },
);

const getScriptSourceFromEmbedCode = (
  trimmedGistSource: string,
): GetScriptSourceResult => {
  const htmlElement = document.createElement("html");
  htmlElement.innerHTML = trimmedGistSource;
  const scriptElement = [...htmlElement.getElementsByTagName("script")].at(0);

  if (!scriptElement) {
    return {
      error: `Invalid script tag in gistSource: "${trimmedGistSource}"`,
    };
  }

  const scriptTagSrc = scriptElement.getAttribute("src");

  // Remove the elements from memory, in case GC didn't do that.
  scriptElement.remove();
  htmlElement.remove();

  if (!scriptTagSrc) {
    return {
      error:
        `Missing "src" attribute in script tag in` +
        ` gistSource: "${trimmedGistSource}"`,
    };
  }

  if (
    !gistScriptSrcRegExp.test(scriptTagSrc) ||
    !scriptTagSrc.endsWith(".js")
  ) {
    return {
      error:
        `Invalid URL in "src" attribute in script tag in` +
        ` gistSource: "${trimmedGistSource}"`,
    };
  }

  return { scriptSource: scriptTagSrc };
};

const getScriptSourceFromGistUrl = (
  trimmedGistSource: string,
): GetScriptSourceResult => {
  if (trimmedGistSource.endsWith(".js")) {
    return {
      scriptSource: trimmedGistSource,
    };
  }

  return { scriptSource: trimmedGistSource.concat(".js") };
};

const gistScriptSrcRegExp =
  /https:\/\/gist\.github\.com\/[A-z0-9-]{1,}\/[A-z0-9]{1,}/;

type GetScriptSourceResult = { error: string } | { scriptSource: string };
