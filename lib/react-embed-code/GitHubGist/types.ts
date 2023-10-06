export type Resizing =
  | "autoAdjustHeightOnMount"
  | "autoAdjustWidthAndHeightOnMount"
  | "autoAdjustWidthOnMount"
  | "fill"
  | "none"
  | `ratio.${number}`;

export type Status = "pending" | "resolved" | "rejected";
