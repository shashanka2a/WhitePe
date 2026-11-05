import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight } from "./icons"

export function Button({
  children,
  href,
  secondary = false,
  dark = false,
}: {
  children: ReactNode
  href: string
  secondary?: boolean
  dark?: boolean
}) {
  return (
    <Link
      className={`button ${secondary ? "button-secondary" : ""} ${
        dark ? "button-dark" : ""
      }`}
      href={href}
    >
      <span>{children}</span>
      <ArrowRight />
    </Link>
  )
}
