interface SalkynAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: 32, md: 44, lg: 56 };

export function SalkynAvatar({ size = "md", className = "" }: SalkynAvatarProps) {
  const px = sizeMap[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="salkyn-bg" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="salkyn-face" x1="16" y1="20" x2="48" y2="52">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#salkyn-bg)" />
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="14"
        fill="url(#salkyn-face)"
        stroke="#22D3EE"
        strokeWidth="1.5"
      />
      <ellipse cx="24" cy="28" rx="5" ry="6" fill="#22D3EE" opacity="0.9" />
      <ellipse cx="40" cy="28" rx="5" ry="6" fill="#22D3EE" opacity="0.9" />
      <circle cx="24" cy="28" r="2" fill="#0f172a" />
      <circle cx="40" cy="28" r="2" fill="#0f172a" />
      <path
        d="M22 40 Q32 48 42 40"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="48" cy="16" r="3" fill="#10B981" className="animate-pulse" />
      <text x="32" y="58" textAnchor="middle" fill="#67E8F9" fontSize="7" fontWeight="bold">
        SALKYN
      </text>
    </svg>
  );
}
