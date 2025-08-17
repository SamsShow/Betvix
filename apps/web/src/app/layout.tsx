import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Betvix - On-Chain Prediction Markets',
  description: 'Make predictions on real-world news events',
  manifest: '/manifest.json',
  themeColor: '#121212',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Betvix',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-background text-text-primary antialiased">
        <div className="flex min-h-screen w-full justify-center items-start">
          {/* Mobile app shell with gradient boundary for large screens */}
          <div className="mt-6 mb-8 rounded-[26px] bg-gradient-to-br from-accent-purple/30 via-white/10 to-transparent p-[1.5px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="relative w-full max-w-[430px] rounded-[24px] ring-1 ring-white/10 bg-background overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
