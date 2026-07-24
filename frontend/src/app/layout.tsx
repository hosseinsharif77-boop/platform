import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'پلتفرم قیمت زنده | بازارچه آنلاین',
  description: 'بازارچه چندفروشنده‌ای مدرن با موتور قیمت‌گذاری پویا و قیمت‌های لحظه‌ای',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${vazirmatn.variable} font-body antialiased`} style={{ background: '#060608', color: '#F2F2F5' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
