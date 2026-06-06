interface PlaneIconProps {
  className?: string;
  size?: number;
}

/** Side-profile aircraft — reads clearly at pictogram thumb size */
export function PlaneIcon({ className = "", size = 20 }: PlaneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3 11.5h4.2l1.8-3.2 2.2 3.2H21l-1.8 1.6-1.6-.8-4.8 1.2-1.4-2.4-2.8 1.2L3 11.5z"
        fill="currentColor"
      />
      <path
        d="M8.5 8.3l1.2 3.2M15 9.8l-.8 2.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M19.5 12.8l2 1.2v1.2h-2.2"
        fill="currentColor"
      />
    </svg>
  );
}
