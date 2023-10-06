import { logger } from "logger";

export const resizers = {
  autoAdjustHeightOnMount: (documentElement: HTMLElement) => {
    const heightPx = documentElement.scrollHeight;
    logger.debug("autoAdjustHeightOnMount", {
      heightPx,
    });
    return { heightPx, widthPx: undefined };
  },
  autoAdjustWidthAndHeightOnMount: (documentElement: HTMLElement) => {
    const heightPx = documentElement.scrollHeight;
    const gistDataElement = documentElement.querySelector("tr");

    if (!gistDataElement) {
      logger.error("Cannot find tr element!");
      return { heightPx, widthPx: undefined };
    }
    /* TODO: figure out why the measurement is not exact and we need to add
     2px */
    const widthPx = gistDataElement.scrollWidth + 2;

    logger.debug("autoAdjustWidthAndHeightOnMount", {
      heightPx,
      widthPx,
    });

    return { heightPx, widthPx };
  },
  autoAdjustWidthOnMount: (documentElement: HTMLElement) => {
    const gistDataElement = documentElement.querySelector("tr");

    if (!gistDataElement) {
      logger.error("Cannot find tr element!");
      return { heightPx: undefined, widthPx: undefined };
    }

    const widthPx = gistDataElement.scrollWidth + 2;

    logger.debug("autoAdjustWidth", {
      widthPx,
    });

    return {
      widthPx,
      heightPx: undefined,
    };
  },
};
