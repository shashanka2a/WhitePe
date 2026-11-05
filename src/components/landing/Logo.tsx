import Link from "next/link"

export function Logo({
  light = false,
  decorative = false,
}: {
  light?: boolean
  /** Render as plain markup (no link), e.g. inside illustrations. */
  decorative?: boolean
}) {
  const className = `logo ${light ? "logo-light" : ""}`
  const mark = (
    <>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="M16 3.5 28.5 16 16 28.5 3.5 16 16 3.5Z"
            fill="currentColor"
          />
          <path
            d="M10.25 18.2 16 11.8l5.75 6.4"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>White<strong>Pe</strong></span>
    </>
  )
  if (decorative)
    return (
      <span className={className} aria-hidden="true">
        {mark}
      </span>
    )
  return (
    <Link className={className} href="/" aria-label="WhitePe home">
      {mark}
    </Link>
  )
}
