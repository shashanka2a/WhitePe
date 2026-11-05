export const ArrowUpRight = ({
  size = 15,
  className = "",
}: {
  size?: number
  className?: string
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={`icon-arrow-up-right ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, flexShrink: 0 }}
  >
    <path
      d="M5.25 14.75 14.5 5.5M7 5.5h7.5V13"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const ArrowRight = ({
  size = 15,
  className = "",
}: {
  size?: number
  className?: string
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={`icon-arrow-right ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, flexShrink: 0 }}
  >
    <path
      d="M3.75 10h12.5m-4.5-4.25L16 10l-4.25 4.25"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Check = ({
  small = false,
  size,
  className = "",
}: {
  small?: boolean
  size?: number
  className?: string
}) => {
  const s = size ?? (small ? 16 : 20)
  return (
    <svg
      width={s}
      height={s}
      className={`check-icon ${small ? "check-small" : ""} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        width: `${s}px`,
        height: `${s}px`,
        minWidth: `${s}px`,
        minHeight: `${s}px`,
        flexShrink: 0,
      }}
    >
      <path
        d="m7 12.5 3.2 3.2L17.5 8.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ScanIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M11 5H7.5A2.5 2.5 0 0 0 5 7.5V11m16-6h3.5A2.5 2.5 0 0 1 27 7.5V11m-16 16H7.5A2.5 2.5 0 0 1 5 24.5V21m16 6h3.5a2.5 2.5 0 0 0 2.5-2.5V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="10"
        y="10"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect x="18" y="10" width="4" height="4" rx=".8" fill="currentColor" />
      <rect x="10" y="18" width="4" height="4" rx=".8" fill="currentColor" />
      <path
        d="M18 18h4v4h-2m-2-2h2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function WalletIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M7 10.5h16.5A2.5 2.5 0 0 1 26 13v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 15h6v6h-6a3 3 0 0 1 0-6Z"
        fill="currentColor"
        opacity=".18"
      />
      <circle cx="20.5" cy="18" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function SettleIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m10.5 16.3 3.6 3.6 7.8-8.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
