import { logger } from "../shared/logger";
import { CssSize, Resizing } from "./types";
import { getKeys, includes } from "../shared/safe";

export const getResizer = (resizing: Resizing) => {
  if (resizing.startsWith("ratio:")) {
    return ratioResizer;
  }

  if (includes(getKeys(resizers), resizing)) {
    return resizers[resizing];
  }

  return null;
};

const ratioResizer: Resizer = () => ({
  width: "100%",
  height: "auto",
});

const resizers: Record<Resizing, Resizer> = {
  autoAdjustHeightOnMount: (documentElement) => {
    const height = documentElement.scrollHeight;
    logger.debug("autoAdjustHeightOnMount", {
      height,
    });
    return { height, width: undefined };
  },
  autoAdjustWidthAndHeightOnMount: (documentElement) => {
    const height = documentElement.scrollHeight;
    const gistDataElement = documentElement.querySelector("tr");

    if (!gistDataElement) {
      logger.error("Cannot find tr element!");
      return { height, width: undefined };
    }
    /* TODO: figure out why the measurement is not exact and we need to add
     2px */
    const width = gistDataElement.scrollWidth + 2;

    logger.debug("autoAdjustWidthAndHeightOnMount", {
      height,
      width,
    });

    return { height, width };
  },
  autoAdjustWidthOnMount: (documentElement) => {
    const gistDataElement = documentElement.querySelector("tr");

    if (!gistDataElement) {
      logger.error("Cannot find tr element!");
      return { height: undefined, width: undefined };
    }

    const width = gistDataElement.scrollWidth + 2;

    logger.debug("autoAdjustWidth", {
      width,
    });

    return {
      width,
      height: undefined,
    };
  },
  fill: () => ({
    width: "100%",
    height: "100%",
  }),
  none: () => ({
    width: undefined,
    height: undefined,
  }),
};

type Resizer = (documentElement: HTMLElement) => {
  width: CssSize;
  height: CssSize;
};
