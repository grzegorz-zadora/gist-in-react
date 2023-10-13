/**
 * It will resolve once all elements that match the given selector, will be
 * loaded in the given document.
 */
export const waitForAllElementsToLoad = async (
  document: Document,
  selector: string,
) => {
  const linkElements = [...document.querySelectorAll(selector)];

  const linksElementsLoading = linkElements.map(
    (linkElement) =>
      new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(
          () =>
            reject(
              new Error(
                `<link> elements in "${document.URL}" didn't load in` +
                  ` ${timeoutMs}ms`,
              ),
            ),
          timeoutMs,
        );

        linkElement.addEventListener(
          "load",
          () => {
            clearTimeout(timeoutId);
            resolve();
          },
          {
            once: true,
          },
        );
      }),
  );

  // Wait for all linked resources to be loaded before setting the height
  await Promise.all(linksElementsLoading);
};

const timeoutMs = 30000;
