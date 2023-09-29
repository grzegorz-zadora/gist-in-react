import Link from "next/link";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => (
  <div>
    <nav>
      <Link href="/">Back</Link>
    </nav>
    <main>{children}</main>
  </div>
);

export default Layout;
