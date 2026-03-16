import "./globals.css";

export const metadata = {
  title: "DiffCheck — Document Diff Dashboard",
  description: "Upload documents and generate visual diff reports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
