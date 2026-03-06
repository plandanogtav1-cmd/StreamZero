import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/Toaster';

export const metadata: Metadata = {
  title: {
    default: 'StreamZero — Zero Ads. Zero Cost. Absolute cinema.',
    template: '%s | StreamZero',
  },
  description: 'StreamZero — Stream movies and TV shows for free. Zero ads. Zero cost. Absolute cinema.',
  keywords: ['streaming', 'movies', 'tv shows', 'free', 'cinema', 'no ads'],
  openGraph: {
    type: 'website',
    siteName: 'StreamZero',
    title: 'StreamZero — Zero Ads. Zero Cost. Absolute cinema.',
    description: 'Stream movies and TV shows for free. Zero ads. Zero cost. Absolute cinema.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamZero',
    description: 'Zero Ads. Zero Cost. Absolute cinema.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#22D3EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-textPrimary antialiased min-h-screen">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-white/5 mt-20 py-10 px-4 text-center text-textMuted text-sm">
          <p className="gradient-text font-heading font-bold text-lg mb-2">StreamZero</p>
          <p className="text-xs">Zero Ads. Zero Cost. Absolute cinema.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
