interface AmbulanceIconProps {
  className?: string;
  size?: number;
}

export function AmbulanceIcon({ className = "", size = 20 }: AmbulanceIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="2" y="8" width="14" height="9" rx="1.5" fill="currentColor" opacity="0.9" />
      <path d="M16 11h3l2 3v3h-5v-6z" fill="currentColor" />
      <circle cx="7" cy="18" r="2" fill="#FAF9F7" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" fill="#FAF9F7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="10.5" width="3" height="4" rx="0.5" fill="#FAF9F7" />
      <path d="M10 10.5h2.5v4H10v-2h-1v-2h1z" fill="#FAF9F7" />
    </svg>
  );
}
