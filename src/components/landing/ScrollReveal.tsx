"use client"

import { useEffect, useRef, type ReactNode } from "react"

/** Adds the `is-active` class once the element scrolls into view. */
export function ScrollReveal({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.35 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  )
}
