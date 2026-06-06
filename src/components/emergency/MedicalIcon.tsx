interface MedicalIconProps {
  className?: string;
  size?: number;
}

export function MedicalIcon({ className = "", size = 20 }: MedicalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" opacity="0.15" />
      <path
        d="M11 8v8M8 11h6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
