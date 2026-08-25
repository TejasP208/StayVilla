import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://stayvilla.example'),
  title: 'StayVilla — Unique villa rentals',
  description: 'Exceptional homes in the world’s most beautiful corners.',
  openGraph: {
    title: 'StayVilla — Unique villa rentals',
    description: 'Exceptional homes in the world’s most beautiful corners.',
    images: ['https://images.pexels.com/photos/31817160/pexels-photo-31817160.jpeg?auto=compress&cs=tinysrgb&w=1600'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={inter.className}>{children}</body></html>;
}
