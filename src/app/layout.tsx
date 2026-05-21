import React from "react";
// @ts-ignore
import "../index.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
