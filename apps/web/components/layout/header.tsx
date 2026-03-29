"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@/components/icons/category-icons";
import type { SiteConfig } from "@/lib/site-config-types";

interface HeaderProps {
  config: SiteConfig;
}

export function Header({ config }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-9 rounded-xl bg-forest-500 flex items-center justify-center">
              <HeartIcon className="size-5 text-white" />
            </div>
            <span className="font-semibold text-stone-800 group-hover:text-forest-600 transition-colors">
              {config.shortName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {config.nav.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-stone-600",
                  "rounded-lg hover:bg-stone-100 hover:text-stone-800",
                  "transition-colors"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/request-help">{config.hero.ctaPrimary}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/offer-help">{config.hero.ctaSecondary}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-stone-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-stone-100 mt-2 pt-4">
            <div className="flex flex-col gap-1">
              {config.nav.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 text-base font-medium text-stone-600",
                    "rounded-lg hover:bg-stone-100 hover:text-stone-800",
                    "transition-colors"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-stone-100">
              <Button variant="outline" asChild>
                <Link href="/request-help">{config.hero.ctaPrimary}</Link>
              </Button>
              <Button asChild>
                <Link href="/offer-help">{config.hero.ctaSecondary}</Link>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
