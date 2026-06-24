import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigatorProvider } from "@/context/NavigatorContext";
import { SearchProvider } from "@/context/SearchContext";
import Header from "@/components/Header";
import Navigator from "@/components/Navigator";
import Search from "@/components/Search";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waleed Ahmad | Portfolio & Workspace",
  description: "The interactive workspace of Waleed Ahmad. Exploring the intersection of products, systems, and applied intelligence.",
  keywords: ["Waleed Ahmad", "Software Engineer", "Systems Architect", "Portfolio", "Applied AI", "Next.js", "FastAPI"],
  authors: [{ name: "Waleed Ahmad" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-text-primary">
        <SearchProvider>
          <NavigatorProvider>
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Navigator />
            <Search />
          </NavigatorProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
