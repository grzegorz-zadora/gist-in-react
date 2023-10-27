export const getIframeDocument = (iframe: HTMLIFrameElement) => {
  const { contentDocument } = iframe;

  if (!contentDocument) {
    throw new Error("contentDocument not found");
  }

  return contentDocument;
};
