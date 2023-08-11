import type { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <head>
      <title>with-nextjs</title>
    </head>
    <body>{children}</body>
  </html>
);

export default RootLayout;
