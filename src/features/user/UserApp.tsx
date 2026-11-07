"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChainIcon,
  TokenChainIcon,
  WalletIcon,
  toChainId,
  type TokenSymbol,
} from "@/components/ui/crypto-icons"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"

/* ------------------------------------------------------------------ */
/* Types & mock data                                                   */
/* ------------------------------------------------------------------ */

type AuthMethod = "email" | "metamask"
type Session = { method: AuthMethod; email: string; address: string }
type Page = "home" | "activity" | "wallet" | "settings"
type Stage =
  | "scan"
  | "resolve"
  | "amount"
  | "crypto"
  | "review"
  | "authorize"
  | "processing"
  | "success"

type Merchant = {
  name: string
  upi: string
  category: string
  city: string
  wallet: string
}

type Asset = {
  id: string
  symbol: "WBT" | "USDT" | "USDC" | "ETH"
  chain: string
  price: number
  decimals: number
  fee: number
  eta: string
  kind: "direct" | "swap" | "bridge" | "swapbridge"
}

type Payment = {
  id: string
  date: string
  time: string
  merchant: string
  merchantWallet: string
  upi: string
  inr: number
  symbol: string
  chain: string
  paid: string
  usdt: number
  usdc?: number
  fee: number
  rate: string
  hash: string
  archivId: string
  archivStatus?: "Archived" | "Verifying"
}

const EMBEDDED_WALLET = "0x3FA1c2D84e0B9a57C61d4E8bF20A7D9c15E39C20"
const METAMASK_WALLET = "0x71C7656EC7ab88b098defB751B7401B5f6d82E4B"
const INR_PER_USDT = 88.5
const INR_PER_USDC = INR_PER_USDT
const MAX_INR = 100000

const merchants: Record<string, Merchant> = {
  "bombaycoffee@okaxis": {
    name: "Bombay Coffee Co.",
    upi: "bombaycoffee@okaxis",
    category: "Restaurant",
    city: "Bengaluru",
    wallet: "0x8B42C5e829dE41A19F89738c1a21D6439b7A71F3",
  },
  "freshmart@ybl": {
    name: "Fresh Mart",
    upi: "freshmart@ybl",
    category: "Grocery",
    city: "Mumbai",
    wallet: "0x1D93aB04Fe6C27d8e5A0b3C9714f2E86dA05c7B1",
  },
  "chaiwala@paytm": {
    name: "Chaiwala Express",
    upi: "chaiwala@paytm",
    category: "Restaurant",
    city: "Pune",
    wallet: "0xA05e7F3c91B84d2E6c0F58a73D1b9E42c68F3d09",
  },
}

const SAMPLE_UPI = "bombaycoffee@okaxis"

const assets: Asset[] = [
  {
    id: "usdt-whitechain",
    symbol: "USDT",
    chain: "Whitechain",
    price: 1,
    decimals: 2,
    fee: 0.02,
    eta: "~1 sec",
    kind: "direct",
  },
  {
    id: "wbt-whitechain",
    symbol: "WBT",
    chain: "Whitechain",
    price: 19.5,
    decimals: 4,
    fee: 0.05,
    eta: "~2 sec",
    kind: "swap",
  },
  {
    id: "usdc-base",
    symbol: "USDC",
    chain: "Base",
    price: 1,
    decimals: 2,
    fee: 0.12,
    eta: "~20 sec",
    kind: "bridge",
  },
  {
    id: "eth-arbitrum",
    symbol: "ETH",
    chain: "Arbitrum",
    price: 2508.41,
    decimals: 6,
    fee: 0.18,
    eta: "~35 sec",
    kind: "swapbridge",
  },
]

const initialBalances: Record<string, number> = {
  "usdt-whitechain": 154.2,
  "wbt-whitechain": 65.5,
  "usdc-base": 240,
  "eth-arbitrum": 0.0185,
}

const seedPayments: Payment[] = [
  {
    id: "WP-71942",
    date: "Nov 2, 2026",
    time: "8:14 PM",
    merchant: "Chaiwala Express",
    merchantWallet: merchants["chaiwala@paytm"].wallet,
    upi: "chaiwala@paytm",
    inr: 180,
    symbol: "WBT",
    chain: "Whitechain",
    paid: "0.104 WBT",
    usdt: 2.03,
    usdc: 2.03,
    fee: 0.05,
    rate: "1 WBT = 19.50 USDT",
    hash: "0x5d1e...a7c2",
    archivId: "arc_0x7b2f4891a0c5",
    archivStatus: "Archived",
  },
  {
    id: "WP-71650",
    date: "Oct 29, 2026",
    time: "1:32 PM",
    merchant: "Fresh Mart",
    merchantWallet: merchants["freshmart@ybl"].wallet,
    upi: "freshmart@ybl",
    inr: 1640,
    symbol: "USDC",
    chain: "Base",
    paid: "18.65 USDC",
    usdt: 18.53,
    usdc: 18.53,
    fee: 0.12,
    rate: "1 USDC = 1 USDT",
    hash: "0x92ab...0f43",
    archivId: "arc_0x4e930f1bc81d",
    archivStatus: "Archived",
  },
  {
    id: "WP-71288",
    date: "Oct 24, 2026",
    time: "6:48 PM",
    merchant: "Bombay Coffee Co.",
    merchantWallet: merchants["bombaycoffee@okaxis"].wallet,
    upi: "bombaycoffee@okaxis",
    inr: 420,
    symbol: "ETH",
    chain: "Arbitrum",
    paid: "0.001942 ETH",
    usdt: 4.75,
    usdc: 4.75,
    fee: 0.18,
    rate: "1 ETH = 2,508.41 USDT",
    hash: "0xc3f0...81de",
    archivId: "arc_0x33108d2ae409",
    archivStatus: "Archived",
  },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const shorten = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`

const fmtInr = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`

const fmtNum = (value: number, decimals = 2) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: Math.min(2, decimals),
    maximumFractionDigits: decimals,
  })

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

const randomHex = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join(
    "",
  )

const rateLabel = (asset: Asset) =>
  asset.price === 1
    ? `1 ${asset.symbol} = 1 USDT`
    : `1 ${asset.symbol} = ${fmtNum(asset.price, asset.price > 100 ? 2 : 4)} USDT`

function quoteFor(asset: Asset, usdt: number) {
  const tokenAmount = (usdt + asset.fee) / asset.price
  return {
    tokenAmount,
    label: `${fmtNum(tokenAmount, asset.decimals)} ${asset.symbol}`,
  }
}

function hopsFor(asset: Asset, paid: string, usdt: string, merchant: string) {
  const hops = [{ title: "Your wallet", sub: `${paid} · ${asset.chain}` }]
  if (asset.kind === "swap")
    hops.push({
      title: `Swap ${asset.symbol} to USDT`,
      sub: `On ${asset.chain}`,
    })
  if (asset.kind === "bridge" || asset.kind === "swapbridge")
    hops.push({
      title: "LI.FI Cross-Chain Bridge",
      sub: `${asset.chain} → Whitechain (Aggregated via LI.FI)`,
    })
  if (asset.kind === "direct")
    hops.push({ title: "Direct transfer", sub: "Native Whitechain settlement" })
  hops.push({ title: merchant, sub: `${usdt} USDT · Whitechain` })
  hops.push({ title: "Archiv Web3 Database", sub: "Receipt proof indexed" })
  return hops
}

function stepsFor(asset: Asset) {
  const steps = ["Signature confirmed"]
  if (asset.kind === "swap")
    steps.push(`Swapping ${asset.symbol} to USDT on ${asset.chain}`)
  if (asset.kind === "bridge" || asset.kind === "swapbridge")
    steps.push(`Routing via LI.FI: ${asset.chain} to Whitechain`)
  steps.push("Settling USDT to merchant on Whitechain")
  steps.push("Indexing receipt on Archiv")
  steps.push("Merchant notified")
  return steps
}

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  const paths: Record<string, ReactNode> = {
    home: (
      <path
        d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z"
        {...common}
      />
    ),
    activity: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" {...common} />,
    wallet: (
      <>
        <path
          d="M4 7h14a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V7Zm0 0V6a2 2 0 0 1 2-2h11"
          {...common}
        />
        <path d="M16 11h4v4h-4a2 2 0 0 1 0-4Z" {...common} />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" {...common} />
        <path
          d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"
          {...common}
        />
      </>
    ),
    qr: (
      <>
        <path
          d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"
          {...common}
        />
        <rect x="8" y="8" width="3" height="3" rx=".5" {...common} />
        <path d="M14 8h2v2M8 14h2v2M14 14h2v2h-1" {...common} />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" {...common} />,
    back: <path d="m15 18-6-6 6-6" {...common} />,
    check: <path d="m5 12 4.5 4.5L19 7" {...common} />,
    upload: (
      <path
        d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"
        {...common}
      />
    ),
    download: <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" {...common} />,
    share: (
      <>
        <circle cx="18" cy="5" r="2" {...common} />
        <circle cx="6" cy="12" r="2" {...common} />
        <circle cx="18" cy="19" r="2" {...common} />
        <path d="m8 11 8-5m-8 7 8 5" {...common} />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4l-9 9" {...common} />
        <path
          d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"
          {...common}
        />
      </>
    ),
    bell: (
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8ZM10 21h4"
        {...common}
      />
    ),
    close: <path d="m6 6 12 12M18 6 6 18" {...common} />,
    mail: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" {...common} />
        <path d="m4 8 8 5.5L20 8" {...common} />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" {...common} />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...common} />
      </>
    ),
    arrowdown: <path d="M12 5v14m0 0-5-5m5 5 5-5" {...common} />,
    logout: (
      <path
        d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 8l4 4-4 4M19 12H9"
        {...common}
      />
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="mp-brand" aria-label="WhitePe home">
      <span className="mp-brand-mark">
        <span />
      </span>
      {!compact && (
        <strong>
          White<span style={{ fontWeight: 800 }}>Pe</span>
        </strong>
      )}
    </Link>
  )
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="mp-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}

function ShortAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button className="mp-address" onClick={copy} type="button">
      <span className="mp-live-dot" />
      {shorten(value)}
      <small>{copied ? "Copied" : "Copy"}</small>
    </button>
  )
}

function TokenDot({
  symbol,
  chain,
  size = 38,
}: {
  symbol: TokenSymbol
  chain?: string
  size?: number
}) {
  return (
    <TokenChainIcon
      className="up-token"
      symbol={symbol}
      chain={chain ? toChainId(chain) : undefined}
      size={size}
    />
  )
}

/** Wallet type shown as a pill: brand icon + label. */
function WalletBadge({
  method,
  light = false,
}: {
  method: AuthMethod
  light?: boolean
}) {
  return (
    <span className={`mp-network ${light ? "light" : ""}`}>
      {method === "metamask" ? (
        <WalletIcon wallet="metamask" size={15} />
      ) : (
        <ChainIcon chain="whitechain" size={14} />
      )}
      {method === "metamask" ? "MetaMask" : "Embedded wallet"}
    </span>
  )
}

/** Deterministic pseudo QR so the scanner has something to "read". */
function PseudoQr({ seed = 7 }: { seed?: number }) {
  const size = 21
  const cells = useMemo(() => {
    const out: Array<[number, number]> = []
    let s = seed
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    const inFinder = (x: number, y: number) =>
      (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (!inFinder(x, y) && rand() > 0.52) out.push([x, y])
    return out
  }, [seed])
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" fill="#1f1a25" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="white" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="#1f1a25" />
    </g>
  )
  return (
    <svg viewBox={`0 0 ${size} ${size}`} aria-label="UPI QR code">
      <rect width={size} height={size} fill="white" />
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1f1a25" />
      ))}
    </svg>
  )
}

function ReceiptDetails({ payment }: { payment: Payment }) {
  const archivProof = payment.archivId || `arc_${payment.id.toLowerCase()}`
  return (
    <>
      <div className="mp-receipt-merchant">
        <span className="mp-business-avatar">{initials(payment.merchant)}</span>
        <div>
          <strong>{payment.merchant}</strong>
          <p>{payment.upi}</p>
        </div>
      </div>
      <div className="mp-receipt-section">
        <span>Your payment</span>
        <dl>
          <div>
            <dt>Amount</dt>
            <dd>
              <strong>{fmtInr(payment.inr)}</strong>
            </dd>
          </div>
          <div>
            <dt>Paid with</dt>
            <dd>{payment.paid}</dd>
          </div>
          <div>
            <dt>Source chain</dt>
            <dd>{payment.chain}</dd>
          </div>
          <div>
            <dt>Exchange rate</dt>
            <dd>{payment.rate}</dd>
          </div>
          <div>
            <dt>Routing fee</dt>
            <dd>{payment.fee.toFixed(2)} USDT</dd>
          </div>
        </dl>
      </div>
      <div className="mp-receipt-section">
        <span>Settlement</span>
        <dl>
          <div>
            <dt>Merchant received</dt>
            <dd>
              <strong>{(payment.usdt ?? payment.usdc ?? 0).toFixed(2)} USDT</strong>
            </dd>
          </div>
          <div>
            <dt>Merchant wallet</dt>
            <dd>{shorten(payment.merchantWallet)}</dd>
          </div>
          <div>
            <dt>Whitechain tx</dt>
            <dd>
              <a
                href={`https://explorer.whitechain.io/tx/${payment.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {payment.hash} <Icon name="external" size={14} />
              </a>
            </dd>
          </div>
          <div>
            <dt>Timestamp</dt>
            <dd>
              {payment.date}, {payment.time}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mp-receipt-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span>Archiv Web3 Database</span>
          <span className="mp-archiv-badge">
            <span className="mp-live-dot" /> Verified on Archiv
          </span>
        </div>
        <dl>
          <div>
            <dt>Archiv Proof ID</dt>
            <dd>
              <code className="mp-archiv-code">{archivProof}</code>
            </dd>
          </div>
          <div>
            <dt>Receipt integrity</dt>
            <dd>
              <strong>Immutable & Tamper-proof</strong>
            </dd>
          </div>
        </dl>
      </div>
    </>
  )
}

function ReceiptActions({
  payment,
  notify,
}: {
  payment: Payment
  notify: (message: string) => void
}) {
  const archivProof = payment.archivId || `arc_${payment.id.toLowerCase()}`
  const download = () => {
    const usdtAmt = (payment.usdt ?? payment.usdc ?? 0).toFixed(2)
    const content = `WhitePe receipt\n${payment.id}\n${payment.merchant}\nUPI: ${payment.upi}\nAmount: ${fmtInr(payment.inr)}\nPaid with: ${payment.paid} on ${payment.chain}\nMerchant received: ${usdtAmt} USDT on Whitechain\nArchiv Proof ID: ${archivProof}\nWhitechain tx: ${payment.hash}\n${payment.date}, ${payment.time}`
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${payment.id}-receipt.txt`
    link.click()
    URL.revokeObjectURL(url)
    notify("Receipt downloaded")
  }
  const share = async () => {
    const text = `WhitePe receipt ${payment.id}: paid ${fmtInr(payment.inr)} to ${payment.merchant} with ${payment.paid}. Stored on Archiv (${archivProof}).`
    try {
      if (navigator.share)
        await navigator.share({ title: "WhitePe receipt", text })
      else {
        await navigator.clipboard?.writeText(text)
        notify("Receipt details copied")
      }
    } catch {
      /* share dismissed */
    }
  }
  return (
    <div className="mp-receipt-actions">
      <button className="mp-secondary" type="button" onClick={() => void share()}>
        <Icon name="share" />
        Share
      </button>
      <button className="mp-primary" type="button" onClick={download}>
        <Icon name="download" />
        Download
      </button>
    </div>
  )
}

function ReceiptDrawer({
  payment,
  onClose,
  notify,
}: {
  payment: Payment
  onClose: () => void
  notify: (message: string) => void
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      className="mp-drawer-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="mp-receipt"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Payment receipt"
      >
        <div className="mp-receipt-head">
          <div>
            <span className="mp-card-label">Payment receipt</span>
            <h2>{payment.id}</h2>
          </div>
          <button
            className="mp-icon-button"
            onClick={onClose}
            type="button"
            aria-label="Close receipt"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="mp-receipt-status">
          <span className="mp-success-icon">
            <Icon name="check" />
          </span>
          <div>
            <strong>{fmtInr(payment.inr)} paid</strong>
            <p>Settled as USDT on Whitechain · Stored on Archiv</p>
          </div>
          <span className="mp-payment-status completed">
            <i />
            Completed
          </span>
        </div>
        <ReceiptDetails payment={payment} />
        <ReceiptActions payment={payment} notify={notify} />
      </aside>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Welcome / auth                                                      */
/* ------------------------------------------------------------------ */

function Welcome({
  onDone,
  onBack,
}: {
  onDone: (session: Session) => void
  onBack: () => void
}) {
  type Phase = "choose" | "otp" | "creating" | "connecting" | "ready"
  const [phase, setPhase] = useState<Phase>("choose")
  const [method, setMethod] = useState<AuthMethod>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")

  const address = method === "email" ? EMBEDDED_WALLET : METAMASK_WALLET

  const submitEmail = (event: FormEvent) => {
    event.preventDefault()
    if (!email.includes("@")) return
    setMethod("email")
    setPhase("otp")
  }

  const verifyCode = (event: FormEvent) => {
    event.preventDefault()
    if (code.length !== 6) return
    setPhase("creating")
    window.setTimeout(() => setPhase("ready"), 1300)
  }

  const connectMetaMask = () => {
    setMethod("metamask")
    setPhase("connecting")
    window.setTimeout(() => setPhase("ready"), 1200)
  }

  return (
    <div className="mp-onboarding">
      <header className="mp-onboarding-header">
        <button
          type="button"
          className="mp-icon-button"
          onClick={onBack}
          aria-label="Back to WhitePe"
        >
          <Icon name="back" />
        </button>
        <Brand />
        <span className="mp-secure">Secure sign-in</span>
      </header>
      <main className="mp-onboarding-main up-welcome-main">
        <section className="mp-auth-card mp-enter" key={phase}>
          <span className="mp-kicker">Welcome</span>
          <h1>
            Pay any UPI QR
            <br />
            <em>with crypto.</em>
          </h1>

          {phase === "choose" && (
            <>
              <p>
                Sign in with email for an instant embedded wallet, or connect
                the wallet you already use.
              </p>
              <form onSubmit={submitEmail} className="mp-auth-form">
                <Field label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@email.com"
                    required
                  />
                </Field>
                <button className="mp-primary" type="submit">
                  Continue with email
                </button>
                <small>
                  Powered by Privy · A secure embedded wallet is created for
                  you
                </small>
              </form>
              <div className="mp-or">
                <span>or connect an existing wallet</span>
              </div>
              <div className="mp-wallet-options up-single">
                <button type="button" onClick={connectMetaMask}>
                  <WalletIcon wallet="metamask" size={26} />Connect MetaMask
                </button>
              </div>
            </>
          )}

          {phase === "otp" && (
            <>
              <p>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it to
                continue.
              </p>
              <form onSubmit={verifyCode} className="mp-auth-form">
                <Field label="Verification code" hint="Demo: any 6 digits work">
                  <input
                    className="up-otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    autoFocus
                  />
                </Field>
                <button
                  className="mp-primary"
                  type="submit"
                  disabled={code.length !== 6}
                >
                  Verify & create wallet
                </button>
              </form>
              <div className="up-link-row">
                <button
                  type="button"
                  className="up-link"
                  onClick={() => {
                    setCode("")
                    setPhase("choose")
                  }}
                >
                  Use a different email
                </button>
                <button type="button" className="up-link">
                  Resend code
                </button>
              </div>
            </>
          )}

          {(phase === "creating" || phase === "connecting") && (
            <div className="mp-connected mp-enter up-working">
              <span className="mp-spinner dark" />
              <div>
                <strong>
                  {phase === "creating"
                    ? "Creating your wallet…"
                    : "Waiting for MetaMask…"}
                </strong>
                <p>
                  {phase === "creating"
                    ? "Setting up your embedded Whitechain wallet with Privy."
                    : "Approve the connection request in your MetaMask window."}
                </p>
              </div>
            </div>
          )}

          {phase === "ready" && (
            <div className="mp-connected mp-enter">
              <span className="mp-success-icon">
                <Icon name="check" size={24} />
              </span>
              <div>
                <strong>
                  {method === "email"
                    ? "Embedded wallet ready"
                    : "MetaMask connected"}
                </strong>
                <p>
                  {method === "email"
                    ? "Your Privy-secured wallet was created and linked to your email."
                    : "Your external wallet is connected. You stay in control of every signature."}
                </p>
              </div>
              <ShortAddress value={address} />
              <button
                className="mp-primary"
                type="button"
                onClick={() => onDone({ method, email, address })}
              >
                Continue to WhitePe <Icon name="chevron" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pay flow                                                            */
/* ------------------------------------------------------------------ */

const progressLabels = ["Scan", "Amount", "Crypto", "Review", "Pay"]

const stageIndex: Record<Stage, number> = {
  scan: 0,
  resolve: 0,
  amount: 1,
  crypto: 2,
  review: 3,
  authorize: 4,
  processing: 4,
  success: 5,
}

function MerchantStrip({ merchant }: { merchant: Merchant }) {
  return (
    <div className="up-merchant-strip">
      <span className="mp-business-avatar">{initials(merchant.name)}</span>
      <div>
        <strong>{merchant.name}</strong>
        <small>{merchant.upi}</small>
      </div>
      <span className="mp-verified">
        <Icon name="check" size={13} />
        Verified
      </span>
    </div>
  )
}

function PayFlow({
  session,
  balances,
  onClose,
  onPaid,
  notify,
}: {
  session: Session
  balances: Record<string, number>
  onClose: () => void
  onPaid: (payment: Payment, assetId: string, tokenAmount: number) => void
  notify: (message: string) => void
}) {
  const [stage, setStage] = useState<Stage>("scan")
  const [upi, setUpi] = useState("")
  const [manual, setManual] = useState("")
  const [scanning, setScanning] = useState(false)
  const [lookup, setLookup] = useState<"loading" | "found" | "missing">(
    "loading",
  )
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [amount, setAmount] = useState("")
  const [assetId, setAssetId] = useState("")
  const [signing, setSigning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [receipt, setReceipt] = useState<Payment | null>(null)
  const [ttl, setTtl] = useState(30)
  const qrRef = useRef<HTMLInputElement>(null)

  const inr = parseFloat(amount) || 0
  const usdt = inr / INR_PER_USDT
  const usdc = usdt
  const asset = assets.find((item) => item.id === assetId) ?? null
  const quote = asset ? quoteFor(asset, usdt) : null
  const busy = stage === "processing" || signing || scanning

  // Resolve merchant from UPI id
  useEffect(() => {
    if (stage !== "resolve") return
    const timer = window.setTimeout(() => {
      const found = merchants[upi.trim().toLowerCase()] ?? null
      setMerchant(found)
      setLookup(found ? "found" : "missing")
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [stage, upi])

  // Quote countdown
  useEffect(() => {
    if (stage !== "review") return
    const timer = window.setInterval(
      () => setTtl((value) => (value <= 1 ? 30 : value - 1)),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [stage])

  // Processing timeline
  useEffect(() => {
    if (stage !== "processing" || !asset || !merchant || !quote) return
    const steps = stepsFor(asset)
    if (progress < steps.length) {
      const timer = window.setTimeout(() => setProgress((value) => value + 1), 1000)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => {
      const now = new Date()
      const payment: Payment = {
        id: `WP-${Math.floor(10000 + Math.random() * 89999)}`,
        date: now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        merchant: merchant.name,
        merchantWallet: merchant.wallet,
        upi: merchant.upi,
        inr,
        symbol: asset.symbol,
        chain: asset.chain,
        paid: quote.label,
        usdt,
        usdc,
        fee: asset.fee,
        rate: rateLabel(asset),
        hash: `0x${randomHex(4)}...${randomHex(4)}`,
        archivId: `arc_0x${randomHex(12)}`,
        archivStatus: "Archived",
      }
      setReceipt(payment)
      onPaid(payment, asset.id, quote.tokenAmount)
      setStage("success")
    }, 700)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, progress])

  const goResolve = (value: string) => {
    setUpi(value)
    setMerchant(null)
    setLookup("loading")
    setStage("resolve")
  }

  const simulateScan = () => {
    setScanning(true)
    window.setTimeout(() => {
      setScanning(false)
      goResolve(SAMPLE_UPI)
    }, 1400)
  }

  const uploadQr = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return
    event.target.value = ""
    simulateScan()
  }

  const submitManual = (event: FormEvent) => {
    event.preventDefault()
    if (manual.includes("@")) goResolve(manual)
  }

  const authorize = () => {
    setSigning(true)
    window.setTimeout(() => {
      setSigning(false)
      setProgress(0)
      setStage("processing")
    }, 1600)
  }

  const back = () => {
    if (busy) return
    const previous: Partial<Record<Stage, Stage>> = {
      resolve: "scan",
      amount: "scan",
      crypto: "amount",
      review: "crypto",
      authorize: "review",
    }
    const target = previous[stage]
    if (target) setStage(target)
    else onClose()
  }

  const step = stageIndex[stage]

  return (
    <div className="mp-onboarding">
      <header className="mp-onboarding-header">
        <button
          type="button"
          className="mp-icon-button"
          onClick={back}
          disabled={busy}
          aria-label="Go back"
        >
          <Icon name={stage === "scan" || stage === "success" ? "close" : "back"} />
        </button>
        <Brand />
        <span className="mp-secure">Secure payment</span>
      </header>
      <div className="mp-progress-wrap">
        <div className="mp-progress up-progress">
          {progressLabels.map((label, index) => (
            <div
              className={`mp-progress-step ${step >= index ? "active" : ""}`}
              key={label}
            >
              <span>
                {step > index ? <Icon name="check" size={14} /> : index + 1}
              </span>
              <small>{label}</small>
            </div>
          ))}
          <div className="mp-progress-line">
            <i style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      <main className="mp-onboarding-main up-flow-main">
        {/* ---------------- Scan ---------------- */}
        {stage === "scan" && (
          <section className="up-card mp-enter">
            <span className="mp-kicker">Scan UPI QR</span>
            <h1>Scan a merchant QR.</h1>
            <p className="up-sub">
              Point your camera at any UPI QR code. We’ll find the merchant
              and handle the crypto side.
            </p>
            <div className={`up-viewfinder ${scanning ? "scanning" : ""}`}>
              <div className="up-viewfinder-qr">
                <PseudoQr seed={11} />
              </div>
              <i className="tl" />
              <i className="tr" />
              <i className="bl" />
              <i className="br" />
              <span className="up-scan-line" />
              <small className="up-viewfinder-note">
                {scanning ? "QR detected · reading…" : "Camera preview · demo"}
              </small>
            </div>
            <div className="up-actions-col">
              <button
                className="mp-primary"
                type="button"
                onClick={simulateScan}
                disabled={scanning}
              >
                {scanning ? (
                  <span className="mp-spinner" />
                ) : (
                  <>
                    <Icon name="qr" />
                    Scan sample QR
                  </>
                )}
              </button>
              <button
                className="mp-secondary"
                type="button"
                onClick={() => qrRef.current?.click()}
                disabled={scanning}
              >
                <Icon name="upload" />
                Upload QR image
              </button>
              <input
                ref={qrRef}
                hidden
                type="file"
                accept="image/png,image/jpeg"
                onChange={uploadQr}
              />
            </div>
            <div className="mp-or">
              <span>or enter UPI ID</span>
            </div>
            <form className="up-inline-form" onSubmit={submitManual}>
              <Field label="UPI ID / VPA">
                <input
                  value={manual}
                  onChange={(event) => setManual(event.target.value)}
                  placeholder="merchant@upi"
                />
              </Field>
              <button
                className="mp-secondary"
                type="submit"
                disabled={!manual.includes("@") || scanning}
              >
                Find
              </button>
            </form>
          </section>
        )}

        {/* ---------------- Resolve ---------------- */}
        {stage === "resolve" && (
          <section className="up-card mp-enter">
            {lookup === "loading" && (
              <div className="up-center-block">
                <span className="mp-spinner dark up-big-spinner" />
                <strong>Resolving merchant…</strong>
                <p>Looking up {upi} on WhitePe.</p>
              </div>
            )}
            {lookup === "found" && merchant && (
              <>
                <span className="mp-kicker">Merchant found</span>
                <h1>Pay {merchant.name}?</h1>
                <p className="up-sub">
                  This merchant is registered on WhitePe and can receive USDT
                  on Whitechain.
                </p>
                <div className="up-resolved">
                  <MerchantStrip merchant={merchant} />
                  <div className="mp-map-flow">
                    <div>
                      <small>UPI identity</small>
                      <strong>{merchant.upi}</strong>
                    </div>
                    <span>
                      <Icon name="chevron" />
                    </span>
                    <div>
                      <small>Whitechain wallet</small>
                      <strong>{shorten(merchant.wallet)}</strong>
                    </div>
                  </div>
                  <div className="up-meta-row">
                    <span>{merchant.category}</span>
                    <span>{merchant.city}</span>
                  </div>
                </div>
                <div className="mp-form-actions up-actions">
                  <button className="mp-secondary" type="button" onClick={back}>
                    Rescan
                  </button>
                  <button
                    className="mp-primary"
                    type="button"
                    onClick={() => setStage("amount")}
                  >
                    Continue <Icon name="chevron" />
                  </button>
                </div>
              </>
            )}
            {lookup === "missing" && (
              <div className="up-center-block">
                <span className="up-error-icon">
                  <Icon name="close" size={26} />
                </span>
                <strong>Merchant not on WhitePe</strong>
                <p>
                  We couldn’t find <b>{upi}</b>. Ask the merchant to join
                  WhitePe, or try another QR.
                </p>
                <button className="mp-primary" type="button" onClick={back}>
                  Scan again
                </button>
              </div>
            )}
          </section>
        )}

        {/* ---------------- Amount ---------------- */}
        {stage === "amount" && merchant && (
          <section className="up-card mp-enter">
            <MerchantStrip merchant={merchant} />
            <span className="mp-kicker up-gap-top">Amount</span>
            <h1>How much are you paying?</h1>
            <div className="up-amount-box">
              <span>₹</span>
              <input
                inputMode="decimal"
                value={amount}
                autoFocus
                onChange={(event) => {
                  const value = event.target.value.replace(/[^0-9.]/g, "")
                  if ((value.match(/\./g) ?? []).length > 1) return
                  if (/\.\d{3,}/.test(value)) return
                  setAmount(value)
                }}
                placeholder="0"
                aria-label="Amount in INR"
              />
            </div>
            <div className="up-chips">
              {[100, 250, 500, 1000].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={inr === value ? "active" : ""}
                  onClick={() => setAmount(String(value))}
                >
                  ₹{value.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
            <div className="up-info-line">
              <span>Merchant receives</span>
              <strong>≈ {fmtNum(usdc)} USDC</strong>
            </div>
            <div className="up-info-line muted">
              <span>Rate</span>
              <span>1 USDC = ₹{INR_PER_USDC.toFixed(2)}</span>
            </div>
            {inr > MAX_INR && (
              <p className="up-error-text">
                Maximum per payment is {fmtInr(MAX_INR)}.
              </p>
            )}
            <div className="mp-form-actions up-actions">
              <button className="mp-secondary" type="button" onClick={back}>
                Back
              </button>
              <button
                className="mp-primary"
                type="button"
                disabled={inr < 1 || inr > MAX_INR}
                onClick={() => setStage("crypto")}
              >
                Choose crypto <Icon name="chevron" />
              </button>
            </div>
          </section>
        )}

        {/* ---------------- Crypto ---------------- */}
        {stage === "crypto" && merchant && (
          <section className="up-card mp-enter">
            <span className="mp-kicker">Pay with</span>
            <h1>Select crypto.</h1>
            <p className="up-sub">
              Paying {fmtInr(inr)} to {merchant.name}. Pick the asset you’d
              like to spend.
            </p>
            <div className="up-asset-list" role="radiogroup">
              {assets.map((item) => {
                const need = quoteFor(item, usdc)
                const balance = balances[item.id] ?? 0
                const enough = balance >= need.tokenAmount
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={assetId === item.id}
                    disabled={!enough}
                    className={`up-asset-row ${assetId === item.id ? "selected" : ""}`}
                    onClick={() => setAssetId(item.id)}
                    key={item.id}
                  >
                    <TokenDot symbol={item.symbol} chain={item.chain} />
                    <span className="up-asset-main">
                      <strong>
                        {item.symbol}
                        <em>{item.chain}</em>
                      </strong>
                      <small>
                        Balance {fmtNum(balance, item.decimals)} {item.symbol}
                      </small>
                    </span>
                    <span className="up-asset-need">
                      {enough ? (
                        <>
                          <strong>{need.label}</strong>
                          <small>{item.eta}</small>
                        </>
                      ) : (
                        <small className="low">Low balance</small>
                      )}
                    </span>
                    <span className="up-radio" />
                  </button>
                )
              })}
            </div>
            <div className="mp-form-actions up-actions">
              <button className="mp-secondary" type="button" onClick={back}>
                Back
              </button>
              <button
                className="mp-primary"
                type="button"
                disabled={!asset}
                onClick={() => {
                  setTtl(30)
                  setStage("review")
                }}
              >
                Review route <Icon name="chevron" />
              </button>
            </div>
          </section>
        )}

        {/* ---------------- Review ---------------- */}
        {stage === "review" && merchant && asset && quote && (
          <section className="up-card mp-enter">
            <span className="mp-kicker">Review route</span>
            <h1>Confirm your payment.</h1>
            <div className="up-review-hero">
              <div>
                <small>
                  <TokenDot symbol={asset.symbol} chain={asset.chain} size={22} />
                  You pay
                </small>
                <strong>{quote.label}</strong>
                <span>on {asset.chain}</span>
              </div>
              <span className="up-review-arrow">
                <Icon name="arrowdown" size={18} />
              </span>
              <div>
                <small>
                  <TokenDot symbol="USDT" chain="Whitechain" size={22} />
                  {merchant.name} receives
                </small>
                <strong>{fmtNum(usdt)} USDT</strong>
                <span>
                  on Whitechain · {fmtInr(inr)}
                </span>
              </div>
            </div>
            <div className="up-route">
              {hopsFor(asset, quote.label, fmtNum(usdt), merchant.name).map(
                (hop, index, list) => (
                  <div
                    className={`up-hop ${index === list.length - 1 ? "last" : ""}`}
                    key={hop.title}
                  >
                    <span className="up-hop-dot" />
                    <div>
                      <strong>{hop.title}</strong>
                      <small>{hop.sub}</small>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="mp-receipt-section up-details">
              <dl>
                <div>
                  <dt>Exchange rate</dt>
                  <dd>{rateLabel(asset)}</dd>
                </div>
                <div>
                  <dt>Bridge protocol</dt>
                  <dd>{asset.kind === "direct" ? "None (Native Whitechain)" : "LI.FI Aggregator"}</dd>
                </div>
                <div>
                  <dt>Routing fee</dt>
                  <dd>{asset.fee.toFixed(2)} USDC</dd>
                </div>
                <div>
                  <dt>Max slippage</dt>
                  <dd>0.5%</dd>
                </div>
                <div>
                  <dt>Estimated time</dt>
                  <dd>{asset.eta}</dd>
                </div>
                <div>
                  <dt>Total debited</dt>
                  <dd>
                    <strong>{quote.label}</strong>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="up-quote">
              <span>Quote refreshes in {ttl}s</span>
              <i>
                <b style={{ width: `${(ttl / 30) * 100}%` }} />
              </i>
            </div>
            <div className="mp-form-actions up-actions">
              <button className="mp-secondary" type="button" onClick={back}>
                Back
              </button>
              <button
                className="mp-primary"
                type="button"
                onClick={() => setStage("authorize")}
              >
                Authorize <Icon name="lock" />
              </button>
            </div>
          </section>
        )}

        {/* ---------------- Authorize ---------------- */}
        {stage === "authorize" && merchant && asset && quote && (
          <section className="up-card mp-enter">
            <span className="mp-kicker">Authorize transaction</span>
            <h1>
              {session.method === "email"
                ? "Approve with your wallet."
                : "Confirm in MetaMask."}
            </h1>
            <p className="up-sub">
              {session.method === "email"
                ? "Your WhitePe embedded wallet will sign this transaction. Nothing leaves your wallet until you approve."
                : "A signature request will open in MetaMask. Review the details there before confirming."}
            </p>
            <div className="up-sign-card">
              <div className="up-sign-head">
                {session.method === "email" ? (
                  <>
                    <span className="mp-brand-mark small">
                      <span />
                    </span>
                    <strong>WhitePe wallet</strong>
                    <small>Secured by Privy</small>
                  </>
                ) : (
                  <>
                    <WalletIcon wallet="metamask" size={22} />
                    <strong>MetaMask</strong>
                    <small>Signature request</small>
                  </>
                )}
              </div>
              <dl>
                <div>
                  <dt>From</dt>
                  <dd>{shorten(session.address)}</dd>
                </div>
                <div>
                  <dt>To</dt>
                  <dd>WhitePe Router</dd>
                </div>
                <div>
                  <dt>Network</dt>
                  <dd>{asset.chain}</dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd>
                    <strong>{quote.label}</strong>
                  </dd>
                </div>
                <div>
                  <dt>Merchant</dt>
                  <dd>{merchant.name}</dd>
                </div>
              </dl>
            </div>
            <div className="up-secure-note">
              <Icon name="lock" size={15} />
              Merchants never see your wallet address or balances.
            </div>
            <div className="mp-form-actions up-actions">
              <button
                className="mp-secondary"
                type="button"
                onClick={back}
                disabled={signing}
              >
                Back
              </button>
              <button
                className="mp-primary"
                type="button"
                onClick={authorize}
                disabled={signing}
              >
                {signing ? (
                  <>
                    <span className="mp-spinner" />
                    {session.method === "email"
                      ? "Signing…"
                      : "Waiting for MetaMask…"}
                  </>
                ) : session.method === "email" ? (
                  <>
                    Approve & pay {fmtInr(inr)}
                  </>
                ) : (
                  <>Confirm in MetaMask</>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ---------------- Processing ---------------- */}
        {stage === "processing" && merchant && asset && quote && (
          <section className="up-card mp-enter">
            <span className="mp-kicker">Processing</span>
            <h1>Sending your payment.</h1>
            <p className="up-sub">
              Keep this page open. This usually takes {asset.eta}.
            </p>
            <div className="up-timeline">
              {stepsFor(asset).map((label, index) => {
                const state =
                  progress > index
                    ? "done"
                    : progress === index
                      ? "active"
                      : "pending"
                return (
                  <div className={`up-step ${state}`} key={label}>
                    <span>
                      {state === "done" ? (
                        <Icon name="check" size={14} />
                      ) : state === "active" ? (
                        <span className="mp-spinner dark small" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <strong>{label}</strong>
                  </div>
                )
              })}
            </div>
            <div className="up-info-line">
              <span>Paying {merchant.name}</span>
              <strong>{fmtInr(inr)}</strong>
            </div>
          </section>
        )}

        {/* ---------------- Success ---------------- */}
        {stage === "success" && receipt && (
          <section className="up-card up-success mp-enter">
            <span className="mp-success-ring">
              <Icon name="check" size={34} />
            </span>
            <span className="mp-kicker">Payment successful</span>
            <h1>{fmtInr(receipt.inr)}</h1>
            <p className="up-sub">
              Paid to {receipt.merchant} with {receipt.paid}.
            </p>
            <div className="up-receipt-box">
              <div className="up-receipt-title">
                <span className="mp-card-label">Receipt</span>
                <strong>{receipt.id}</strong>
              </div>
              <ReceiptDetails payment={receipt} />
            </div>
            <ReceiptActions payment={receipt} notify={notify} />
            <button className="mp-secondary up-done" type="button" onClick={onClose}>
              Back to home
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Consumer home & dashboard                                           */
/* ------------------------------------------------------------------ */

const navItems: Array<{ id: Page; label: string; icon: string }> = [
  { id: "home", label: "Home", icon: "home" },
  { id: "activity", label: "Activity", icon: "activity" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "settings", label: "Settings", icon: "settings" },
]

const portfolioValue = (balances: Record<string, number>) =>
  assets.reduce(
    (total, item) => total + (balances[item.id] ?? 0) * item.price,
    0,
  )

function PaymentList({
  payments,
  onSelect,
  limit,
}: {
  payments: Payment[]
  onSelect: (payment: Payment) => void
  limit?: number
}) {
  const list = limit ? payments.slice(0, limit) : payments
  if (list.length === 0)
    return (
      <div className="mp-empty">
        <span>
          <Icon name="activity" />
        </span>
        <strong>No payments yet</strong>
        <p>Scan a UPI QR to make your first crypto payment.</p>
      </div>
    )
  return (
    <div className="up-pay-list">
      {list.map((payment) => (
        <button type="button" key={payment.id} onClick={() => onSelect(payment)}>
          <span className="mp-business-avatar">{initials(payment.merchant)}</span>
          <span className="up-pay-main">
            <strong>{payment.merchant}</strong>
            <small>
              {payment.date} · {payment.time}
            </small>
          </span>
          <span className="up-pay-amount">
            <strong>−{fmtInr(payment.inr)}</strong>
            <small>{payment.paid}</small>
          </span>
          <Icon name="chevron" size={17} />
        </button>
      ))}
    </div>
  )
}

function HomePage({
  session,
  balances,
  payments,
  onPay,
  onSelect,
  setPage,
}: {
  session: Session
  balances: Record<string, number>
  payments: Payment[]
  onPay: () => void
  onSelect: (payment: Payment) => void
  setPage: (page: Page) => void
}) {
  const name = session.email ? session.email.split("@")[0] : "there"
  const total = portfolioValue(balances)
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Home</span>
          <h1>Hi, {name}.</h1>
          <p>Pay any UPI QR with the crypto you already hold.</p>
        </div>
      </div>
      <div className="mp-overview-grid">
        <section className="up-scan-card">
          <span className="up-scan-icon">
            <Icon name="qr" size={30} />
          </span>
          <h2>Scan UPI QR</h2>
          <p>
            Scan a merchant’s QR, choose your crypto, and they receive USDT on
            Whitechain.
          </p>
          <button type="button" onClick={onPay}>
            Scan & Pay <Icon name="chevron" size={17} />
          </button>
        </section>
        <aside className="mp-balance-card">
          <div className="mp-card-head">
            <span className="mp-card-label">Your wallet</span>
            <WalletBadge method={session.method} />
          </div>
          <span className="mp-usdc-mark">
            <TokenChainIcon symbol="USDT" chain="whitechain" size={44} />
          </span>
          <small>Portfolio value</small>
          <strong>
            {fmtNum(total)} <em>USDT</em>
          </strong>
          <ShortAddress value={session.address} />
          <button
            className="mp-secondary"
            type="button"
            onClick={() => setPage("wallet")}
          >
            View wallet <Icon name="chevron" />
          </button>
        </aside>
      </div>

      <div className="mp-recent-head">
        <div>
          <h2>Your assets</h2>
          <p>Available to spend across chains</p>
        </div>
      </div>
      <div className="up-assets">
        {assets.map((item) => (
          <article key={item.id}>
            <TokenDot symbol={item.symbol} chain={item.chain} />
            <div>
              <small>
                {item.symbol} · {item.chain}
              </small>
              <strong>{fmtNum(balances[item.id] ?? 0, item.decimals)}</strong>
              <p>≈ ${fmtNum((balances[item.id] ?? 0) * item.price)}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mp-recent-head">
        <div>
          <h2>Recent payments</h2>
          <p>Your latest merchant payments</p>
        </div>
        <button type="button" onClick={() => setPage("activity")}>
          View all <Icon name="chevron" size={16} />
        </button>
      </div>
      <div className="mp-table-card">
        <PaymentList payments={payments} onSelect={onSelect} limit={3} />
      </div>
    </div>
  )
}

function WalletPage({
  session,
  balances,
}: {
  session: Session
  balances: Record<string, number>
}) {
  const total = portfolioValue(balances)
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Wallet</span>
          <h1>Your wallet</h1>
          <p>
            {session.method === "email"
              ? "Embedded wallet created with Privy."
              : "External wallet connected with MetaMask."}
          </p>
        </div>
      </div>
      <section className="mp-wallet-hero">
        <div>
          <span className="mp-usdc-mark">
            <TokenChainIcon symbol="USDT" chain="whitechain" size={44} />
          </span>
          <WalletBadge method={session.method} light />
        </div>
        <small>Portfolio value</small>
        <strong>
          {fmtNum(total)} <em>USDT</em>
        </strong>
        <p>Across Whitechain, Base and Arbitrum</p>
        <ShortAddress value={session.address} />
      </section>
      <section className="mp-settings-card">
        <div className="mp-recent-head">
          <div>
            <h2>Assets</h2>
            <p>Balances by token and network</p>
          </div>
        </div>
        <div className="mp-activity-list">
          {assets.map((item) => (
            <div key={item.id}>
              <TokenDot symbol={item.symbol} chain={item.chain} />
              <div>
                <strong>{item.symbol}</strong>
                <small>{item.chain}</small>
              </div>
              <span className="up-right">
                <strong>
                  {fmtNum(balances[item.id] ?? 0, item.decimals)} {item.symbol}
                </strong>
                <small>≈ ${fmtNum((balances[item.id] ?? 0) * item.price)}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SettingsPage({
  session,
  notify,
  onSignOut,
}: {
  session: Session
  notify: (message: string) => void
  onSignOut: () => void
}) {
  const [receipts, setReceipts] = useState(true)
  const [security, setSecurity] = useState(true)
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Preferences</span>
          <h1>Settings</h1>
          <p>Manage your account, wallet and notifications.</p>
        </div>
      </div>
      <div className="mp-settings-columns">
        <section className="mp-settings-card">
          <h2>Account</h2>
          <div className="mp-settings-grid one">
            <Field label="Sign-in method">
              <input
                value={
                  session.method === "email"
                    ? "Email · Privy embedded wallet"
                    : "MetaMask · External wallet"
                }
                disabled
              />
            </Field>
            {session.email && (
              <Field label="Email">
                <input value={session.email} disabled />
              </Field>
            )}
            <Field label="Wallet address">
              <input value={session.address} disabled />
            </Field>
          </div>
          <button className="mp-secondary up-signout" type="button" onClick={onSignOut}>
            <Icon name="logout" />
            Sign out
          </button>
        </section>
        <section className="mp-settings-card">
          <h2>Notifications</h2>
          <div className="mp-toggle-row">
            <div>
              <strong>Payment receipts</strong>
              <p>Get a receipt when a payment completes.</p>
            </div>
            <button
              className={`mp-toggle ${receipts ? "active" : ""}`}
              onClick={() => {
                setReceipts(!receipts)
                notify("Preference saved")
              }}
              type="button"
              aria-label="Toggle payment receipts"
            >
              <i />
            </button>
          </div>
          <div className="mp-toggle-row">
            <div>
              <strong>Security alerts</strong>
              <p>Important wallet and account activity.</p>
            </div>
            <button
              className={`mp-toggle ${security ? "active" : ""}`}
              onClick={() => {
                setSecurity(!security)
                notify("Preference saved")
              }}
              type="button"
              aria-label="Toggle security alerts"
            >
              <i />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Dashboard({
  session,
  balances,
  payments,
  onPay,
  onExit,
  onSignOut,
  notify,
  toast,
}: {
  session: Session
  balances: Record<string, number>
  payments: Payment[]
  onPay: () => void
  onExit: () => void
  onSignOut: () => void
  notify: (message: string) => void
  toast: string
}) {
  const [page, setPage] = useState<Page>("home")
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState<Payment | null>(null)
  const title = navItems.find((item) => item.id === page)?.label
  const label = session.email || shorten(session.address)

  // Start every page at the top when switching tabs (important with the mobile bottom nav).
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [page])

  return (
    <div className={`mp-dashboard ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="mp-sidebar">
        <div className="mp-sidebar-brand">
          <Brand compact={collapsed} />
          <button
            className="mp-collapse"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse sidebar"
          >
            <Icon name="back" size={17} />
          </button>
        </div>
        <button className="mp-primary up-sidebar-cta" type="button" onClick={onPay}>
          <Icon name="qr" />
          <span>Scan & Pay</span>
        </button>
        <nav>
          {navItems.map((item) => (
            <button
              type="button"
              className={page === item.id ? "active" : ""}
              onClick={() => setPage(item.id)}
              key={item.id}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mp-sidebar-account">
          <span className="mp-business-avatar">
            {label.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong>{label}</strong>
            <small>
              {session.method === "email" ? "Embedded wallet" : "MetaMask"}
            </small>
          </div>
          <button type="button" onClick={onExit} aria-label="Return to site">
            <Icon name="external" size={16} />
          </button>
        </div>
      </aside>
      <div className="mp-dashboard-main">
        <header className="mp-topbar">
          <div className="mp-mobile-brand">
            <Brand />
          </div>
          <div>
            <span>{title}</span>
            <small>
              {session.method === "email"
                ? "Embedded wallet · Privy"
                : "External wallet · MetaMask"}
            </small>
          </div>
          <div className="mp-top-actions">
            <button
              className="mp-icon-button"
              type="button"
              aria-label="Notifications"
              onClick={() => notify("You’re all caught up")}
            >
              <Icon name="bell" />
            </button>
            <ShortAddress value={session.address} />
            <span className="mp-avatar">{label.slice(0, 2).toUpperCase()}</span>
          </div>
        </header>
        <main className="mp-content">
          {page === "home" && (
            <HomePage
              session={session}
              balances={balances}
              payments={payments}
              onPay={onPay}
              onSelect={setSelected}
              setPage={setPage}
            />
          )}
          {page === "activity" && (
            <div className="mp-page mp-enter">
              <div className="mp-page-heading">
                <div>
                  <span className="mp-kicker">Transactions</span>
                  <h1>Activity</h1>
                  <p>Every merchant payment you’ve made with crypto.</p>
                </div>
                <button className="mp-primary" type="button" onClick={onPay}>
                  <Icon name="qr" />
                  New payment
                </button>
              </div>
              <div className="mp-table-card">
                <PaymentList payments={payments} onSelect={setSelected} />
              </div>
            </div>
          )}
          {page === "wallet" && (
            <WalletPage session={session} balances={balances} />
          )}
          {page === "settings" && (
            <SettingsPage
              session={session}
              notify={notify}
              onSignOut={onSignOut}
            />
          )}
        </main>
      </div>
      <nav className="mp-bottom-nav" aria-label="Primary">
        {navItems.slice(0, 2).map((item) => (
          <button
            type="button"
            className={page === item.id ? "active" : ""}
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => setPage(item.id)}
            key={item.id}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
        <button type="button" className="up-scan-tab" onClick={onPay}>
          <span className="up-scan-circle">
            <Icon name="qr" />
          </span>
          <span>Scan</span>
        </button>
        {navItems.slice(2).map((item) => (
          <button
            type="button"
            className={page === item.id ? "active" : ""}
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => setPage(item.id)}
            key={item.id}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {selected && (
        <ReceiptDrawer
          payment={selected}
          onClose={() => setSelected(null)}
          notify={notify}
        />
      )}
      {toast && (
        <div className="mp-toast">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export default function UserApp() {
  const router = useRouter()
  const onExit = () => router.push("/")
  const [session, setSession] = useState<Session | null>(null)
  const [paying, setPaying] = useState(false)
  const [payments, setPayments] = useState<Payment[]>(seedPayments)
  const [balances, setBalances] = useState(initialBalances)
  const [toast, setToast] = useState("")

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2200)
  }

  if (!session) return <Welcome onDone={setSession} onBack={onExit} />

  if (paying)
    return (
      <>
        <PayFlow
          session={session}
          balances={balances}
          notify={notify}
          onClose={() => setPaying(false)}
          onPaid={(payment, assetId, tokenAmount) => {
            setPayments((list) => [payment, ...list])
            setBalances((current) => ({
              ...current,
              [assetId]: Math.max(0, (current[assetId] ?? 0) - tokenAmount),
            }))
          }}
        />
        {toast && (
          <div className="mp-toast">
            <Icon name="check" size={17} />
            {toast}
          </div>
        )}
      </>
    )

  return (
    <Dashboard
      session={session}
      balances={balances}
      payments={payments}
      onPay={() => setPaying(true)}
      onExit={onExit}
      onSignOut={() => setSession(null)}
      notify={notify}
      toast={toast}
    />
  )
}
