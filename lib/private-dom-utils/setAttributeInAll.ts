/**
 * It will set the given attribute in all elements that match the given selector
 * in the given document.
 */
export const setAttributeInAll = ({
  document,
  selector,
  attribute,
}: {
  document: Document;
  selector: string;
  attribute: {
    name: string;
    value: string;
  };
}) => {
  const matchingElements = [...document.querySelectorAll(selector)];

  matchingElements.forEach((element) =>
    element.setAttribute(attribute.name, attribute.value),
  );
};
