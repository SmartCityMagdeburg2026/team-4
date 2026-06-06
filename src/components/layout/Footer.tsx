"use client";

import { useTranslations } from "@/lib/i18n/LocaleProvider";

interface FooterProps {
  dataSource: string;
  lastUpdated: string;
}

export function Footer({ dataSource, lastUpdated }: FooterProps) {
  const t = useTranslations();

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-serif text-lg text-ink">MAGmagdeburg</p>
            <p className="text-sm text-ink-muted mt-1">{t("footer.subtitle")}</p>
          </div>
          <div className="text-sm text-ink-muted space-y-1">
            <p>
              {t("footer.dataSource")}: {dataSource}
            </p>
            <p>
              {t("footer.lastUpdated")}: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
