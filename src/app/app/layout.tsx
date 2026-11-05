import type { Metadata } from "next"
import "@/styles/merchant.css"
import "@/styles/user.css"

export const metadata: Metadata = {
  title: "Pay",
  description:
  "Scan a UPI QR and pay with crypto. Merchants receive USDT on Whitechain with receipts indexed on Archiv.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/app" },
}

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
