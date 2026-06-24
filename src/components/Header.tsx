'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search } from 'lucide-react';
import { useNavigator } from '@/context/NavigatorContext';
import { useSearch } from '@/context/SearchContext';

export default function Header() {
  const pathname = usePathname();
  const { toggleNavigator } = useNavigator();
  const { openSearch } = useSearch();

  const primaryNavLinks = [
    { label: 'Products',     href: '/products' },
    { label: 'Systems',      href: '/systems' },
    { label: 'Intelligence', href: '/intelligence' },
  ];

  const secondaryNavLinks = [
    { label: 'Explorer',     href: '/explorer' },
    { label: 'Journey',      href: '/journey' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-muted bg-bg-dark/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-sm tracking-widest text-text-primary hover:text-accent transition-colors flex-shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-semibold hidden sm:inline">WALEED AHMAD</span>
          <span className="font-semibold sm:hidden">WA</span>
          <span className="text-text-muted font-normal hidden md:inline">{'// WORKSPACE'}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5" aria-label="Main navigation">
          <div className="flex items-center gap-6">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-mono tracking-wider transition-all pb-0.5 border-b ${
                  isActive(link.href)
                    ? 'text-accent border-accent'
                    : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span className="h-4 w-px bg-border-muted" aria-hidden="true" />
          <div className="flex items-center gap-5">
            {secondaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-mono tracking-wider transition-all pb-0.5 border-b ${
                  isActive(link.href)
                    ? 'text-accent border-accent/70'
                    : 'text-text-muted border-transparent hover:text-text-secondary hover:border-border-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">

          {/* Search trigger */}
          <button
            onClick={openSearch}
            aria-label="Open search (Ctrl+K)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-muted hover:border-accent/30 bg-bg-panel/70 hover:bg-bg-panel text-text-secondary hover:text-text-primary transition-all text-xs font-mono group"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-text-muted">Search</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border-muted text-[10px] text-text-muted ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Navigator trigger */}
          <button
            onClick={toggleNavigator}
            aria-label="Open workspace navigator"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-muted hover:border-accent/30 bg-bg-panel/70 hover:bg-bg-panel text-text-secondary hover:text-text-primary transition-all text-xs font-mono"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Navigator</span>
          </button>
        </div>
      </div>
    </header>
  );
}
