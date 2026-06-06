"use client";

import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function Header() {
  const t = useTranslations();

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
            {t("header.tagline")}
          </p>
          <h1 className="font-serif text-xl md:text-2xl text-ink tracking-tight mt-0.5">
            MAGmagdeburg
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-ink-muted">
          <a href="#overview" data-cursor-interactive className="hover:text-ink transition-colors">
            {t("nav.overview")}
          </a>
          <a href="#population" data-cursor-interactive className="hover:text-ink transition-colors">
            {t("nav.population")}
          </a>
          <a href="#emergency" data-cursor-interactive className="hover:text-ink transition-colors">
            {t("nav.emergency")}
          </a>
          <a href="#healthcare" data-cursor-interactive className="hover:text-ink transition-colors">
            {t("nav.healthcare")}
          </a>
          <a href="#insights" data-cursor-interactive className="hover:text-ink transition-colors">
            {t("nav.insights")}
          </a>
        </nav>
      </div>
    </header>
  );
}
