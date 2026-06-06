import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div className={`card p-6 md:p-8 ${className}`}>
      <div className="mb-6">
        <h3 className="font-sans text-sm font-medium text-ink">{title}</h3>
        {subtitle && (
          <p className="text-xs text-ink-muted mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
