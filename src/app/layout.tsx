import React from "react";
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
