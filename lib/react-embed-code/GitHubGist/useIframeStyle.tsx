import { CSSProperties, useMemo } from "react";
import { CssSize, Resizing, Status } from "./types";

export const useIframeStyle = ({
  status,
  width,
  height,
  derivedStyle,
  resizing,
}: {
  status: Status;
  width: CssSize;
  height: CssSize;
  derivedStyle: CSSProperties | undefined;
  resizing: Resizing;
}) =>
  useMemo(
    () =>
      ({
        boxSizing: "border-box",
        height,
        width,
        visibility: status === "pending" ? "hidden" : undefined,
        ...getPosition({
          status,
          resizing,
        }),
        ...derivedStyle,
      }) as const,
    [derivedStyle, height, resizing, status, width],
  );

const getPosition = ({
  status,
  resizing,
}: {
  status: Status;
  resizing: Resizing;
}) => {
  if (resizing === "fill") {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as const;
  }

  if (status === "pending") {
    return { position: "absolute" } as const;
  }
};
