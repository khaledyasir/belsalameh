export function SuitcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true" focusable="false">
      <rect x="18" y="2" width="12" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <rect x="4" y="9" width="40" height="28" rx="5" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="2.2" />
      <line x1="24" y1="9" x2="24" y2="37" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="4" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  );
}
