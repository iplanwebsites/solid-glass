/**
 * Crystal ball logo for solid-glass.
 */
export function Logo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="sg-ball" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="75%" stopColor="#6d28d9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="sg-shine" cx="35%" cy="30%" r="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sg-base" x1="30%" y1="100%" x2="70%" y2="80%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      {/* Base / stand */}
      <ellipse cx="50" cy="88" rx="26" ry="6" fill="url(#sg-base)" />
      <rect x="40" y="78" width="20" height="12" rx="3" fill="#475569" />
      {/* Glass sphere */}
      <circle cx="50" cy="46" r="36" fill="url(#sg-ball)" />
      {/* Inner glow / refraction hint */}
      <circle cx="50" cy="46" r="36" fill="url(#sg-shine)" />
      {/* Edge highlight */}
      <circle cx="50" cy="46" r="35" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
      {/* Small specular dot */}
      <circle cx="38" cy="34" r="5" fill="white" fillOpacity="0.45" />
      <circle cx="38" cy="34" r="2.5" fill="white" fillOpacity="0.7" />
    </svg>
  );
}
