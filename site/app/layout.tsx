import type { Metadata } from 'next';
import { DM_Sans, Unbounded } from 'next/font/google';
import './globals.css';

const display = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://velocitydrop.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'VelocityDrop · Game servers on demand',
    template: '%s · VelocityDrop',
  },
  description:
    'Spin up dedicated game servers from Discord with tokens. Pay for play time, not idle months. More titles rolling out over time.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'VelocityDrop · Game servers on demand',
    description:
      'Spin up dedicated game servers from Discord with tokens. Pay for play time, not idle months. More titles rolling out over time.',
    url: siteUrl,
    siteName: 'VelocityDrop',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VelocityDrop · Game servers on demand',
    description:
      'Spin up dedicated game servers from Discord with tokens. Pay for play time, not idle months. More titles rolling out over time.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
