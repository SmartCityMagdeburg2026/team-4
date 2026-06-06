"use client";

import { useTranslations } from "@/lib/i18n/LocaleProvider";

export function Hero() {
  const t = useTranslations();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-8">
      <div className="max-w-3xl animate-fade-in">
        <p className="section-eyebrow mb-4">{t("hero.eyebrow")}</p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.1] mb-6">
          {t("hero.title")}
        </h2>
        <p className="text-lg md:text-xl text-ink-muted leading-relaxed">
          {t("hero.lead")}
        </p>
      </div>
    </div>
  );
}
