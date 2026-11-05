import type { Metadata } from "next"
import "@/styles/merchant.css"

export const metadata: Metadata = {
  title: "Merchant",
  description:
  "Link your UPI QR to a Whitechain wallet and receive USDT from crypto payments with immutable receipts indexed on Archiv.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/merchant" },
}

export default function MerchantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
