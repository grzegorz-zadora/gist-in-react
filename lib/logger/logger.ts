let timestamp: number | null = null;

export const logger = {
  error: (...messages: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(`[ react-embed-code ]`, ...messages);
    }
  },
  debug: (...messages: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      const lastTimestamp = timestamp ?? Date.now();
      timestamp = Date.now();
      const diff = Math.min(999, timestamp - lastTimestamp);

      // Formatted allows for max of 3 digits
      const formattedDiff = "00".concat(String(diff)).slice(-3);

      // eslint-disable-next-line no-console
      console.debug(`[ react-embed-code ] [ ${formattedDiff}ms ]`, ...messages);
    }
  },
};
