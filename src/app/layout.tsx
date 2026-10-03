import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { SearchProvider } from '@/context/SearchContext';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Search from '@/components/Search';
import VersionPill from '@/components/VersionPill';
import { restoreVersionScript } from '@/lib/siteVersion';
import { profile, siteUrl } from '@/data/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const description =
  'Waleed Ahmad is an AI & full-stack developer in Lahore: applied AI (PyTorch, Hugging Face), full-stack products (React, Flutter, Node.js, FastAPI) and the automation that ships them.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    'Waleed Ahmad',
    'AI & Full-Stack Developer',
    'AI Developer',
    'Full-Stack Developer',
    'React',
    'Flutter',
    'FastAPI',
    'Supabase',
    'CI/CD',
    'Playwright',
    'Lahore',
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  openGraph: {
    type: 'website',
    siteName: profile.name,
    title: `${profile.name} · ${profile.role}`,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} · ${profile.role}`,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      // The inline script below sets data-intro before hydration.
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: the homepage opening plays when a visit lands on (or reloads) the homepage. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;try{var n=performance.getEntriesByType('navigation')[0],r=n&&n.type==='reload';if(location.pathname!=='/'||(!r&&sessionStorage.getItem('intro-seen'))||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='skip'}else{sessionStorage.setItem('intro-seen','1')}}catch(e){d.dataset.intro='skip'}",
          }}
        />
        {/* Re-applies an earlier site version chosen on /process, before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: restoreVersionScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SearchProvider>
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <Search />
          <VersionPill />
        </SearchProvider>
      </body>
    </html>
  );
}
