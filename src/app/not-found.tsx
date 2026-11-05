import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/landing/Logo"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main className="status-page">
      <Logo />
      <span className="section-kicker">404</span>
      <h1>This page doesn’t exist.</h1>
      <p>The link may be broken or the page may have moved.</p>
      <Link className="button" href="/">
        <span>Back to home</span>
      </Link>
    </main>
  )
}
