import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LenisProvider } from '@/components/LenisProvider';
import { CursorProvider } from '@/components/Cursor';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Naman Rai — Data Scientist & Brand Strategist',
  description:
    'B.Tech Data Science student at NIET, Greater Noida and core team member of Indevaa Studio. Building ML pipelines and brand systems.',
  keywords: ['Naman Rai', 'Data Science', 'NLP', 'Machine Learning', 'Indevaa Studio', 'Portfolio'],
  authors: [{ name: 'Naman Rai' }],
  openGraph: {
    title: 'Naman Rai — Data Scientist & Brand Strategist',
    description: 'Building ML pipelines that detect fake news at 94% accuracy and brand systems that make people stop scrolling.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="bg-background text-text1 font-dm antialiased overflow-x-hidden">
        <LenisProvider>
          <CursorProvider>
            {children}
          </CursorProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
