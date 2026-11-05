export const siteConfig = {
  name: "WhitePe",
  title: "WhitePe — Pay with crypto. Scan any UPI QR.",
  description:
  "Pay at UPI merchants with crypto from multiple chains while merchants receive USDT on Whitechain with queryable receipts on Archiv.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
} as const
