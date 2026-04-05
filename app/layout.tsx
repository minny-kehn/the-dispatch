import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Ticker from './components/Ticker';

export const metadata: Metadata = {
  title: 'The Dispatch — AI-Powered Newsroom',
  description:
    'Real journalism, produced by AI. The Dispatch delivers in-depth reporting across technology, geopolitics, climate, finance, health, and culture — with complete editorial transparency.',
  keywords: ['AI news', 'AI journalism', 'automated reporting', 'The Dispatch', 'AI newsroom'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Ticker />
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
