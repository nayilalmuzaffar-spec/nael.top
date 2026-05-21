import "../index.css";
// تأكد من وجود ملف الـ CSS الخاص بمشروعك، قد يكون اسمه index.css أو main.css في مشروعك القديم

export const metadata = {
  title: "My App",
  description: "Converted from Vite to Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}