import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hyderabad Monitor | Real-time City Intelligence',
  description:
    'Real-time city intelligence dashboard for Hyderabad, India. Air quality, weather, traffic, stocks, news, and more.',
  keywords: ['Hyderabad', 'dashboard', 'AQI', 'weather', 'traffic', 'city intelligence'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-[#0A0A0A] text-gray-100 font-sans">{children}</body>
    </html>
  );
}
