"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="status-page">
      <span className="section-kicker">Something went wrong</span>
      <h1>We hit an unexpected error.</h1>
      <p>Please try again. If the problem continues, come back in a moment.</p>
      <button className="button" type="button" onClick={reset}>
        <span>Try again</span>
      </button>
    </main>
  )
}
