// src/app/layout.jsx
import './globals.css';          // global Tailwind styles

export const metadata = {
  title: 'Eurovision 2025 Scorecard',
  description: 'Vote for your favourite songs'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">{children}</body>
    </html>
  );
}
