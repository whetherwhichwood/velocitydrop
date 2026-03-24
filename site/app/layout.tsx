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

const SITE_FALLBACK = 'https://velocitydrop.vercel.app';

/** Empty string env vars are common in .env templates; `new URL('')` throws and breaks the whole app. */
function getPublicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return SITE_FALLBACK;
  }
  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProtocol).origin;
  } catch {
    return SITE_FALLBACK;
  }
}

const siteOrigin = getPublicSiteOrigin();

export const metadata: Metadata = {
  title: {
    default: 'VelocityDrop · Game servers on demand',
    template: '%s · VelocityDrop',
  },
  description:
    'Spin up dedicated game servers from Discord with tokens. Pay for play time, not idle months. More titles rolling out over time.',
  metadataBase: new URL(siteOrigin),
  openGraph: {
    title: 'VelocityDrop · Game servers on demand',
    description:
      'Spin up dedicated game servers from Discord with tokens. Pay for play time, not idle months. More titles rolling out over time.',
    url: siteOrigin,
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
