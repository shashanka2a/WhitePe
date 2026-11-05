"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChainIcon,
  TokenChainIcon,
  WalletIcon,
  isTokenSymbol,
  toChainId,
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

type Page = "overview" | "payments" | "profile" | "identity" | "wallet" | "settings"
type PaymentStatus = "Completed" | "Pending" | "Failed"

type Payment = {
  id: string
  date: string
  time: string
  asset: string
  chain: string
  original: string
  usdt: string
  usdc?: string
  status: PaymentStatus
  rate: string
  fee: string
  hash: string
  archivId?: string
}

const WALLET_ADDRESS = "0x8B42...71F3"
const FULL_WALLET = "0x8B42C5e829dE41A19F89738c1a21D6439b7A71F3"

const payments: Payment[] = [
  {
    id: "WP-84291",
    date: "May 18, 2025",
    time: "10:42 AM",
    asset: "ETH",
    chain: "Arbitrum",
    original: "0.0042 ETH",
    usdt: "42.00",
    usdc: "42.00",
    status: "Completed",
    rate: "1 ETH = 2,508.41 USDT",
    fee: "0.18 USDT",
    hash: "0xa92f...83d1",
    archivId: "arc_0x8f29c0a10b42",
  },
  {
    id: "WP-84278",
    date: "May 18, 2025",
    time: "9:17 AM",
    asset: "USDC",
    chain: "Base",
    original: "28.50 USDC",
    usdt: "28.42",
    usdc: "28.42",
    status: "Completed",
    rate: "1 USDC = 1 USDT",
    fee: "0.08 USDT",
    hash: "0x71bc...a420",
    archivId: "arc_0x7b1ac89201f4",
  },
  {
    id: "WP-84254",
    date: "May 17, 2025",
    time: "6:34 PM",
    asset: "WBT",
    chain: "Whitechain",
    original: "1.63 WBT",
    usdt: "31.75",
    usdc: "31.75",
    status: "Completed",
    rate: "1 WBT = 19.50 USDT",
    fee: "0.05 USDT",
    hash: "0x4c8e...12f9",
    archivId: "arc_0x5c42e19a77bd",
  },
  {
    id: "WP-84231",
    date: "May 17, 2025",
    time: "2:05 PM",
    asset: "ETH",
    chain: "Arbitrum",
    original: "0.0028 ETH",
    usdt: "27.82",
    usdc: "27.82",
    status: "Pending",
    rate: "1 ETH = 2,501.70 USDT",
    fee: "0.15 USDT",
    hash: "Processing",
    archivId: "arc_pending_sync",
  },
  {
    id: "WP-84195",
    date: "May 16, 2025",
    time: "7:51 PM",
    asset: "USDC",
    chain: "Base",
    original: "65.00 USDC",
    usdt: "64.82",
    usdc: "64.82",
    status: "Completed",
    rate: "1 USDC = 1 USDT",
    fee: "0.18 USDT",
    hash: "0xbb31...90a7",
    archivId: "arc_0x2a94f09e6631",
  },
  {
    id: "WP-84162",
    date: "May 16, 2025",
    time: "12:26 PM",
    asset: "ETH",
    chain: "Arbitrum",
    original: "0.0061 ETH",
    usdt: "0.00",
    usdc: "0.00",
    status: "Failed",
    rate: "1 ETH = 2,496.12 USDT",
    fee: "0.00 USDT",
    hash: "Not submitted",
  },
]

const chartData = {
  Daily: [32, 45, 38, 64, 52, 78, 70, 92, 68, 86, 108, 96],
  Weekly: [48, 72, 58, 86, 74, 94, 82, 110, 98, 124, 112, 136],
  Monthly: [42, 58, 76, 68, 88, 102, 94, 116, 108, 128, 122, 145],
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  const paths: Record<string, ReactNode> = {
    overview: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.5" {...common} />
        <rect x="14" y="4" width="6" height="6" rx="1.5" {...common} />
        <rect x="4" y="14" width="6" height="6" rx="1.5" {...common} />
        <rect x="14" y="14" width="6" height="6" rx="1.5" {...common} />
      </>
    ),
    payments: (
      <>
        <path
          d="M4 7.5h16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          {...common}
        />
        <path d="M8 15h3" {...common} />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="3.5" {...common} />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" {...common} />
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
          d="M19 13.5v-3l-2-.7a7 7 0 0 0-.7-1.6l.9-1.9-2.1-2.1-1.9.9a7 7 0 0 0-1.6-.7L10.5 2h-3l-.7 2.4a7 7 0 0 0-1.6.7l-1.9-.9-2.1 2.1.9 1.9a7 7 0 0 0-.7 1.6L0 10.5v3l1.4.7a7 7 0 0 0 .7 1.6l-.9 1.9 2.1 2.1 1.9-.9a7 7 0 0 0 1.6.7l.7 2.4h3l.7-2.4a7 7 0 0 0 1.6-.7l1.9.9 2.1-2.1-.9-1.9a7 7 0 0 0 .7-1.6l2.4-.7Z"
          transform="translate(2)"
          {...common}
        />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6" {...common} />
        <path d="m15 15 4 4" {...common} />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" {...common} />,
    back: <path d="m15 18-6-6 6-6" {...common} />,
    upload: (
      <>
        <path
          d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"
          {...common}
        />
      </>
    ),
    check: <path d="m5 12 4.5 4.5L19 7" {...common} />,
    download: (
      <>
        <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" {...common} />
      </>
    ),
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
      <>
        <path
          d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8ZM10 21h4"
          {...common}
        />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" {...common} />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" {...common} />,
    refresh: (
      <>
        <path d="M20 7v5h-5" {...common} />
        <path d="M18.2 16a8 8 0 1 1 .8-8.8L20 12" {...common} />
      </>
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

function ShortAddress({ value = FULL_WALLET }: { value?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <button className="mp-address" onClick={copy} type="button">
      <span className="mp-live-dot" />
      {WALLET_ADDRESS}
      <small>{copied ? "Copied" : "Copy"}</small>
    </button>
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

function QrVisual() {
  return (
    <div className="mp-qr" aria-label="QR preview">
      <i />
      <i />
      <i />
      <span />
      <b />
      <em />
      <u />
      <small />
    </div>
  )
}

function Onboarding({
  onComplete,
  onBack,
}: {
  onComplete: () => void
  onBack: () => void
}) {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState("")
  const [wallet, setWallet] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [business, setBusiness] = useState("Bombay Coffee Co.")
  const [category, setCategory] = useState("Restaurant")
  const [city, setCity] = useState("Bengaluru")
  const [state, setState] = useState("Karnataka")
  const [contact, setContact] = useState("hello@bombaycoffee.co")
  const [logo, setLogo] = useState("")
  const [upi, setUpi] = useState("bombaycoffee@okaxis")
  const [qrPreview, setQrPreview] = useState("")
  const [extracting, setExtracting] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  const qrRef = useRef<HTMLInputElement>(null)

  const readImage = (
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setter(String(reader.result))
    reader.readAsDataURL(file)
  }

  const authenticate = (method: "email" | "wallet") => {
    if (method === "email" && !email.includes("@")) return
    setAuthLoading(true)
    window.setTimeout(() => {
      setWallet(FULL_WALLET)
      setAuthLoading(false)
    }, 750)
  }

  const uploadQr = (event: ChangeEvent<HTMLInputElement>) => {
    readImage(event, setQrPreview)
    setExtracting(true)
    window.setTimeout(() => {
      setUpi("bombaycoffee@okaxis")
      setExtracting(false)
    }, 1100)
  }

  const submitEmail = (event: FormEvent) => {
    event.preventDefault()
    authenticate("email")
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
        <span className="mp-secure">Secure onboarding</span>
      </header>
      <div className="mp-progress-wrap">
        <div className="mp-progress">
          {["Account", "Business", "Payment identity", "Ready"].map(
            (label, index) => (
              <div
                className={`mp-progress-step ${step >= index ? "active" : ""}`}
                key={label}
              >
                <span>
                  {step > index ? <Icon name="check" size={14} /> : index + 1}
                </span>
                <small>{label}</small>
              </div>
            ),
          )}
          <div className="mp-progress-line">
            <i style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>
      </div>

      <main className="mp-onboarding-main">
        {step === 0 && (
          <section className="mp-auth-card mp-enter">
            <span className="mp-kicker">Merchant account</span>
            <h1>
              Start accepting
              <br />
              <em>USDT payments.</em>
            </h1>
            <p>
              Create an account with email or connect a wallet you already use.
            </p>
            {!wallet ? (
              <>
                <form onSubmit={submitEmail} className="mp-auth-form">
                  <Field label="Work email">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@business.com"
                      required
                    />
                  </Field>
                  <button
                    className="mp-primary"
                    type="submit"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <span className="mp-spinner" />
                    ) : (
                      "Continue with email"
                    )}
                  </button>
                  <small>
                    Powered by Privy · An embedded Whitechain wallet will be created
                    for you
                  </small>
                </form>
                <div className="mp-or">
                  <span>or connect an existing wallet</span>
                </div>
                <div className="mp-wallet-options">
                  <button type="button" onClick={() => authenticate("wallet")}>
                    <WalletIcon wallet="metamask" size={26} />MetaMask
                  </button>
                  <button type="button" onClick={() => authenticate("wallet")}>
                    <WalletIcon wallet="walletconnect" size={26} />WalletConnect
                  </button>
                </div>
              </>
            ) : (
              <div className="mp-connected mp-enter">
                <span className="mp-success-icon">
                  <Icon name="check" size={24} />
                </span>
                <div>
                  <strong>Wallet ready</strong>
                  <p>Your Whitechain settlement wallet is connected.</p>
                </div>
                <ShortAddress value={wallet} />
                <button
                  className="mp-primary"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  Set up your business <Icon name="chevron" />
                </button>
              </div>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="mp-form-card mp-enter">
            <div className="mp-form-heading">
              <span className="mp-kicker">Step 2 of 4</span>
              <h1>Tell us about your business.</h1>
              <p>This information appears on payment receipts.</p>
            </div>
            <div className="mp-profile-grid">
              <div className="mp-logo-upload">
                <span>Business logo</span>
                <button type="button" onClick={() => logoRef.current?.click()}>
                  {logo ? (
                    <img src={logo} alt="Business logo preview" />
                  ) : (
                    <span className="mp-logo-placeholder">BC</span>
                  )}
                  <span>
                    <strong>{logo ? "Change logo" : "Upload logo"}</strong>
                    <small>PNG or JPG, up to 5 MB</small>
                  </span>
                </button>
                <input
                  ref={logoRef}
                  hidden
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(event) => readImage(event, setLogo)}
                />
              </div>
              <div className="mp-form-grid">
                <Field label="Business / shop name">
                  <input
                    value={business}
                    onChange={(event) => setBusiness(event.target.value)}
                  />
                </Field>
                <Field label="Business category">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {[
                      "Restaurant",
                      "Retail",
                      "Grocery",
                      "Services",
                      "Electronics",
                      "Other",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
                <Field label="City">
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                </Field>
                <Field label="State">
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                  />
                </Field>
                <Field label="Contact email">
                  <input
                    type="email"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                  />
                </Field>
              </div>
            </div>
            <div className="mp-form-actions">
              <button
                className="mp-secondary"
                onClick={() => setStep(0)}
                type="button"
              >
                Back
              </button>
              <button
                className="mp-primary"
                onClick={() => setStep(2)}
                disabled={!business || !city || !contact}
                type="button"
              >
                Continue <Icon name="chevron" />
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mp-form-card mp-identity-setup mp-enter">
            <div className="mp-form-heading">
              <span className="mp-kicker">Step 3 of 4</span>
              <h1>Connect your existing UPI QR.</h1>
              <p>
                We use the UPI ID in your QR as the unique link to your Whitechain
                wallet.
              </p>
            </div>
            <div className="mp-identity-grid">
              <div>
                <div className="mp-upload-panel">
                  <input
                    ref={qrRef}
                    hidden
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={uploadQr}
                  />
                  {qrPreview ? (
                    <img src={qrPreview} alt="Uploaded UPI QR preview" />
                  ) : (
                    <QrVisual />
                  )}
                  <div>
                    <strong>
                      {qrPreview ? "QR uploaded" : "Upload your UPI QR"}
                    </strong>
                    <p>PNG or JPG from any UPI app</p>
                  </div>
                  <button
                    type="button"
                    className="mp-secondary"
                    onClick={() => qrRef.current?.click()}
                  >
                    <Icon name="upload" />
                    {qrPreview ? "Replace" : "Choose image"}
                  </button>
                </div>
                <div className="mp-or">
                  <span>or enter manually</span>
                </div>
                <Field label="UPI ID / VPA" hint="Example: merchant@upi">
                  <input
                    value={upi}
                    onChange={(event) => setUpi(event.target.value)}
                    placeholder="merchant@upi"
                  />
                </Field>
              </div>
              <div className="mp-mapping-card">
                <span className="mp-card-label">Mapping preview</span>
                {extracting ? (
                  <div className="mp-extracting">
                    <span className="mp-spinner dark" />
                    <strong>Reading merchant details…</strong>
                    <p>Extracting the UPI identity from your QR.</p>
                  </div>
                ) : (
                  <>
                    <div className="mp-merchant-preview">
                      <span className="mp-business-avatar">
                        {business.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <strong>{business}</strong>
                        <p>
                          {category} · {city}
                        </p>
                      </div>
                      <span className="mp-verified">
                        <Icon name="check" size={13} />
                        Ready
                      </span>
                    </div>
                    <div className="mp-map-flow">
                      <div>
                        <small>UPI identity</small>
                        <strong>{upi || "Not added"}</strong>
                      </div>
                      <span>
                        <Icon name="chevron" />
                      </span>
                      <div>
                        <small>Whitechain wallet</small>
                        <strong>{WALLET_ADDRESS}</strong>
                      </div>
                    </div>
                    <div className="mp-info-note">
                      WhitePe maps this UPI identity to your registered wallet.
                      Customer crypto payments settle as USDT on Whitechain with immutable receipts on Archiv.
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mp-form-actions">
              <button
                className="mp-secondary"
                onClick={() => setStep(1)}
                type="button"
              >
                Back
              </button>
              <button
                className="mp-primary"
                onClick={() => setStep(3)}
                disabled={!upi || extracting}
                type="button"
              >
                Confirm mapping <Icon name="check" />
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mp-success-card mp-enter">
            <span className="mp-success-ring">
              <Icon name="check" size={34} />
            </span>
            <span className="mp-kicker">Setup complete</span>
            <h1>Your merchant profile is ready.</h1>
            <p>You can now receive USDT settlements on Whitechain with receipts on Archiv.</p>
            <div className="mp-success-summary">
              <div>
                <small>Business</small>
                <strong>{business}</strong>
              </div>
              <div>
                <small>Linked UPI ID</small>
                <strong>{upi}</strong>
              </div>
              <div>
                <small>Whitechain wallet</small>
                <strong>{WALLET_ADDRESS}</strong>
              </div>
              <div>
                <small>Merchant status</small>
                <strong className="mp-status-approved">
                  <span />
                  Active
                </strong>
              </div>
            </div>
            <button className="mp-primary" type="button" onClick={onComplete}>
              Go to Dashboard <Icon name="chevron" />
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

const navItems: Array<{
  id: Page
  label: string
  short: string
  icon: string
  /** Shown as a tab in the mobile bottom nav; the rest live under "More". */
  primary: boolean
}> = [
    { id: "overview", label: "Overview", short: "Overview", icon: "overview", primary: true },
    { id: "payments", label: "Payments", short: "Payments", icon: "payments", primary: true },
    { id: "identity", label: "Payment Identity", short: "Identity", icon: "qr", primary: true },
    { id: "wallet", label: "Wallet", short: "Wallet", icon: "wallet", primary: true },
    { id: "profile", label: "Business Profile", short: "Business", icon: "profile", primary: false },
    { id: "settings", label: "Settings", short: "Settings", icon: "settings", primary: false },
  ]

function Status({ value }: { value: PaymentStatus }) {
  return (
    <span className={`mp-payment-status ${value.toLowerCase()}`}>
      <i />
      {value}
    </span>
  )
}

function PaymentTable({
  onSelect,
  compact = false,
}: {
  onSelect: (payment: Payment) => void
  compact?: boolean
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(false)
  const visible = useMemo(
    () =>
      payments
        .filter((payment) => {
          const matchQuery = `${payment.id} ${payment.asset} ${payment.chain}`
            .toLowerCase()
            .includes(query.toLowerCase())
          return matchQuery && (status === "All" || payment.status === status)
        })
        .slice(0, compact ? 4 : undefined),
    [query, status, compact],
  )
  const refresh = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 700)
  }

  return (
    <div className="mp-table-card">
      {!compact && (
        <div className="mp-table-tools">
          <label className="mp-search">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search transaction or asset"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <button
            className="mp-icon-button"
            type="button"
            onClick={refresh}
            aria-label="Refresh payments"
          >
            <Icon name="refresh" />
          </button>
        </div>
      )}
      {loading ? (
        <div className="mp-table-loading">
          {[1, 2, 3, 4].map((item) => (
            <span key={item} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="mp-empty">
          <span>
            <Icon name="search" />
          </span>
          <strong>No payments found</strong>
          <p>Try changing your search or status filter.</p>
        </div>
      ) : (
        <div className="mp-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date & time</th>
                <th>Customer paid</th>
                <th>USDC received</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((payment) => (
                <tr key={payment.id} onClick={() => onSelect(payment)}>
                  <td>
                    <strong>{payment.id}</strong>
                  </td>
                  <td>
                    {payment.date}
                    <small>{payment.time}</small>
                  </td>
                  <td>
                    {isTokenSymbol(payment.asset) ? (
                      <TokenChainIcon
                        symbol={payment.asset}
                        chain={toChainId(payment.chain)}
                        size={32}
                      />
                    ) : null}
                    <span>
                      {payment.original}
                      <small>{payment.chain}</small>
                    </span>
                  </td>
                  <td>
                    <strong>{payment.usdt ?? payment.usdc} USDT</strong>
                    <small>on Whitechain</small>
                  </td>
                  <td>
                    <Status value={payment.status} />
                  </td>
                  <td>
                    <button type="button" aria-label={`View ${payment.id}`}>
                      <Icon name="chevron" size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Receipt({
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

  const archivProof = payment.archivId || `arc_${payment.id.toLowerCase()}`
  const usdtVal = payment.usdt ?? payment.usdc

  const download = () => {
    const content = `WhitePe receipt\n${payment.id}\nBombay Coffee Co.\nUPI: bombaycoffee@okaxis\nCustomer paid: ${payment.original} on ${payment.chain}\nUSDT received: ${usdtVal}\nArchiv Proof ID: ${archivProof}\nWhitechain tx: ${payment.hash}`
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${payment.id}-receipt.txt`
    link.click()
    URL.revokeObjectURL(url)
    notify("Receipt downloaded")
  }
  const share = async () => {
    const text = `WhitePe receipt ${payment.id}: ${usdtVal} USDT received by Bombay Coffee Co. Stored on Archiv (${archivProof}).`
    if (navigator.share)
      await navigator.share({ title: "WhitePe receipt", text })
    else {
      await navigator.clipboard?.writeText(text)
      notify("Receipt details copied")
    }
  }
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
          <button className="mp-icon-button" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>
        <div className="mp-receipt-status">
          <span className="mp-success-icon">
            <Icon name="check" />
          </span>
          <div>
            <strong>{usdtVal} USDT received</strong>
            <p>Settled to your wallet on Whitechain · Stored on Archiv</p>
          </div>
          <Status value={payment.status} />
        </div>
        <div className="mp-receipt-merchant">
          <span className="mp-business-avatar">BC</span>
          <div>
            <strong>Bombay Coffee Co.</strong>
            <p>bombaycoffee@okaxis</p>
          </div>
        </div>
        <div className="mp-receipt-section">
          <span>Customer payment</span>
          <dl>
            <div>
              <dt>Original asset</dt>
              <dd>{payment.original}</dd>
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
              <dd>{payment.fee}</dd>
            </div>
          </dl>
        </div>
        <div className="mp-receipt-section">
          <span>Settlement</span>
          <dl>
            <div>
              <dt>Final amount</dt>
              <dd>
                <strong>{usdtVal} USDT</strong>
              </dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>{WALLET_ADDRESS}</dd>
            </div>
            <div>
              <dt>Whitechain transaction</dt>
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
              <dt>Receipt storage</dt>
              <dd>
                <strong>Immutable & Tamper-proof</strong>
              </dd>
            </div>
          </dl>
        </div>
        <div className="mp-receipt-actions">
          <button
            className="mp-secondary"
            type="button"
            onClick={() => void share()}
          >
            <Icon name="share" />
            Share
          </button>
          <button className="mp-primary" type="button" onClick={download}>
            <Icon name="download" />
            Download
          </button>
        </div>
      </aside>
    </div>
  )
}

function Overview({
  onSelect,
  setPage,
}: {
  onSelect: (payment: Payment) => void
  setPage: (page: Page) => void
}) {
  const [range, setRange] = useState<keyof typeof chartData>("Weekly")
  const max = Math.max(...chartData[range])
  const metrics = [
    ["Total USDC received", "$4,286.42", "+12.4%", "wallet"],
    ["Total payments", "184", "+18 this week", "payments"],
    ["Successful payments", "178", "96.7% success", "check"],
    ["Pending payments", "3", "Being routed", "refresh"],
    ["Average transaction", "$23.30", "+4.2%", "overview"],
  ]
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Dashboard</span>
          <h1>Good morning, Bombay Coffee.</h1>
          <p>Here’s how your business is doing today.</p>
        </div>
        <button
          className="mp-primary mp-payment-link"
          type="button"
          onClick={() => setPage("payments")}
        >
          View payments <Icon name="chevron" />
        </button>
      </div>
      <div className="mp-metrics">
        {metrics.map(([label, value, note, icon]) => (
          <article key={label}>
            <span className="mp-metric-icon">
              <Icon name={icon} />
            </span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
              <p>{note}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mp-overview-grid">
        <section className="mp-chart-card">
          <div className="mp-card-head">
            <div>
              <span className="mp-card-label">Transaction volume</span>
              <strong>$1,248.80 USDC</strong>
            </div>
            <div className="mp-segmented">
              {Object.keys(chartData).map((item) => (
                <button
                  type="button"
                  className={range === item ? "active" : ""}
                  onClick={() => setRange(item as keyof typeof chartData)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mp-chart">
            <div className="mp-chart-lines">
              <i />
              <i />
              <i />
            </div>
            {chartData[range].map((value, index) => (
              <span
                key={`${range}-${index}`}
                style={{
                  height: `${(value / max) * 82}%`,
                  animationDelay: `${index * 35}ms`,
                }}
              >
                <i />
              </span>
            ))}
          </div>
          <div className="mp-chart-labels">
            <span>May 12</span>
            <span>May 14</span>
            <span>May 16</span>
            <span>Today</span>
          </div>
        </section>
        <aside className="mp-balance-card">
          <div className="mp-card-head">
            <span className="mp-card-label">Settlement wallet</span>
            <span className="mp-network">
              <ChainIcon chain="whitechain" size={14} />
              Whitechain
            </span>
          </div>
          <span className="mp-usdc-mark">
            <TokenChainIcon symbol="USDT" chain="whitechain" size={44} />
          </span>
          <small>Available balance</small>
          <strong>
            4,286.42 <em>USDT</em>
          </strong>
          <ShortAddress />
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
          <h2>Recent payments</h2>
          <p>Your latest customer transactions</p>
        </div>
        <button type="button" onClick={() => setPage("payments")}>
          View all <Icon name="chevron" size={16} />
        </button>
      </div>
      <PaymentTable compact onSelect={onSelect} />
    </div>
  )
}

function ProfilePage({ notify }: { notify: (message: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [logo, setLogo] = useState("")
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(String(reader.result))
    reader.readAsDataURL(file)
  }
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Account</span>
          <h1>Business Profile</h1>
          <p>Manage the details shown on payment receipts.</p>
        </div>
        <button
          className={editing ? "mp-primary" : "mp-secondary"}
          type="button"
          onClick={() => {
            if (editing) notify("Business profile saved")
            setEditing(!editing)
          }}
        >
          {editing ? "Save changes" : "Edit profile"}
        </button>
      </div>
      <section className="mp-settings-card">
        <div className="mp-profile-banner">
          <label className="mp-edit-logo">
            {logo ? <img src={logo} alt="Logo preview" /> : <span>BC</span>}
            {editing && (
              <>
                <small>Change</small>
                <input hidden type="file" accept="image/*" onChange={upload} />
              </>
            )}
          </label>
          <div>
            <h2>Bombay Coffee Co.</h2>
            <p>Restaurant · Bengaluru, Karnataka</p>
          </div>
          <span className="mp-status-approved">
            <i />
            Active merchant
          </span>
        </div>
        <div className="mp-settings-grid">
          <Field label="Business / shop name">
            <input defaultValue="Bombay Coffee Co." disabled={!editing} />
          </Field>
          <Field label="Business category">
            <select defaultValue="Restaurant" disabled={!editing}>
              <option>Restaurant</option>
              <option>Retail</option>
              <option>Grocery</option>
            </select>
          </Field>
          <Field label="City">
            <input defaultValue="Bengaluru" disabled={!editing} />
          </Field>
          <Field label="State">
            <input defaultValue="Karnataka" disabled={!editing} />
          </Field>
          <Field label="Contact email">
            <input defaultValue="hello@bombaycoffee.co" disabled={!editing} />
          </Field>
          <Field label="Merchant ID">
            <input defaultValue="MER-10482" disabled />
          </Field>
        </div>
      </section>
    </div>
  )
}

function IdentityPage({ notify }: { notify: (message: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [upi, setUpi] = useState("bombaycoffee@okaxis")
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Payments</span>
          <h1>Payment Identity</h1>
          <p>Manage the UPI identity mapped to your Whitechain wallet.</p>
        </div>
      </div>
      <section className="mp-identity-page-card">
        <div className="mp-large-qr">
          <QrVisual />
          <span>Linked and active</span>
        </div>
        <div className="mp-identity-details">
          <span className="mp-card-label">Current payment identity</span>
          <h2>{upi}</h2>
          <p>
            Customer payments referencing this identity are routed to your
            registered Whitechain settlement wallet.
          </p>
          <div className="mp-map-flow">
            <div>
              <small>UPI identity</small>
              <strong>{upi}</strong>
            </div>
            <span>
              <Icon name="chevron" />
            </span>
            <div>
              <small>Whitechain wallet</small>
              <strong>{WALLET_ADDRESS}</strong>
            </div>
          </div>
          {editing ? (
            <div className="mp-inline-edit">
              <Field label="New UPI ID / VPA">
                <input
                  value={upi}
                  onChange={(event) => setUpi(event.target.value)}
                />
              </Field>
              <button
                className="mp-primary"
                type="button"
                onClick={() => {
                  setEditing(false)
                  notify("Payment identity updated")
                }}
              >
                Confirm update
              </button>
              <button
                className="mp-secondary"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="mp-secondary"
              type="button"
              onClick={() => setEditing(true)}
            >
              Update payment identity
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

function WalletPage() {
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Settlement</span>
          <h1>Whitechain Wallet</h1>
          <p>Your USDT settlement balance and onchain activity.</p>
        </div>
      </div>
      <section className="mp-wallet-hero">
        <div>
          <span className="mp-usdc-mark">
            <TokenChainIcon symbol="USDT" chain="whitechain" size={44} />
          </span>
          <span className="mp-network light">
            <ChainIcon chain="whitechain" size={14} />
            Whitechain
          </span>
        </div>
        <small>USDT balance</small>
        <strong>
          4,286.42 <em>USDT</em>
        </strong>
        <p>≈ $4,286.42 USD</p>
        <ShortAddress />
      </section>
      <section className="mp-settings-card">
        <div className="mp-recent-head">
          <div>
            <h2>Wallet activity</h2>
            <p>USDT settlements received on Whitechain</p>
          </div>
          <a
            href="https://explorer.whitechain.io"
            target="_blank"
            rel="noreferrer"
          >
            Open explorer <Icon name="external" size={15} />
          </a>
        </div>
        <div className="mp-activity-list">
          {payments
            .filter((item) => item.status === "Completed")
            .slice(0, 4)
            .map((item) => (
              <div key={item.id}>
                <span className="mp-activity-icon">
                  <Icon name="check" />
                </span>
                <div>
                  <strong>USDT settlement</strong>
                  <small>
                    {item.id} · {item.date}
                  </small>
                </div>
                <strong>+{item.usdt ?? item.usdc} USDT</strong>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

function SettingsPage({ notify }: { notify: (message: string) => void }) {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  return (
    <div className="mp-page mp-enter">
      <div className="mp-page-heading">
        <div>
          <span className="mp-kicker">Preferences</span>
          <h1>Settings</h1>
          <p>Manage account security and notifications.</p>
        </div>
      </div>
      <div className="mp-settings-columns">
        <section className="mp-settings-card">
          <h2>Account</h2>
          <div className="mp-settings-grid one">
            <Field label="Account email">
              <input defaultValue="hello@bombaycoffee.co" />
            </Field>
            <Field label="Connected wallet">
              <input defaultValue={FULL_WALLET} disabled />
            </Field>
          </div>
          <button
            className="mp-primary"
            type="button"
            onClick={() => notify("Account settings saved")}
          >
            Save changes
          </button>
        </section>
        <section className="mp-settings-card">
          <h2>Notifications</h2>
          <div className="mp-toggle-row">
            <div>
              <strong>Payment confirmations</strong>
              <p>Email me when a USDC settlement completes.</p>
            </div>
            <button
              className={`mp-toggle ${emailAlerts ? "active" : ""}`}
              onClick={() => setEmailAlerts(!emailAlerts)}
              type="button"
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
              className={`mp-toggle ${securityAlerts ? "active" : ""}`}
              onClick={() => setSecurityAlerts(!securityAlerts)}
              type="button"
            >
              <i />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Dashboard({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<Page>("overview")
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState<Payment | null>(null)
  const [toast, setToast] = useState("")
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2200)
  }
  const [moreOpen, setMoreOpen] = useState(false)
  const title = navItems.find((item) => item.id === page)?.label
  const bottomTabs = navItems.filter((item) => item.primary)
  const moreItems = navItems.filter((item) => !item.primary)
  const moreTabActive = moreItems.some((item) => item.id === page)

  // Start every page at the top when switching tabs (important with the mobile bottom nav).
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [page])

  // Let Escape close the "More" sheet and lock scroll while open.
  useEffect(() => {
    if (!moreOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [moreOpen])

  return (
    <div className={`mp-dashboard ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="mp-sidebar">
        <div className="mp-sidebar-brand">
          <Brand compact={collapsed} />
          <button
            className="mp-collapse"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon name="back" size={17} />
          </button>
        </div>
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
          <span className="mp-business-avatar">BC</span>
          <div>
            <strong>Bombay Coffee</strong>
            <small>Active merchant</small>
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
            <small>Merchant ID · MER-10482</small>
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
            <ShortAddress />
            <span className="mp-avatar">BC</span>
          </div>
        </header>
        <main className="mp-content">
          {page === "overview" && (
            <Overview onSelect={setSelected} setPage={setPage} />
          )}
          {page === "payments" && (
            <div className="mp-page mp-enter">
              <div className="mp-page-heading">
                <div>
                  <span className="mp-kicker">Transactions</span>
                  <h1>Payments</h1>
                  <p>Track customer payments and USDC settlements.</p>
                </div>
                <button
                  className="mp-secondary"
                  type="button"
                  onClick={() => notify("Payment report downloaded")}
                >
                  <Icon name="download" />
                  Export
                </button>
              </div>
              <PaymentTable onSelect={setSelected} />
            </div>
          )}
          {page === "profile" && <ProfilePage notify={notify} />}
          {page === "identity" && <IdentityPage notify={notify} />}
          {page === "wallet" && <WalletPage />}
          {page === "settings" && <SettingsPage notify={notify} />}
        </main>
      </div>
      <nav className="mp-bottom-nav" aria-label="Primary">
        {bottomTabs.map((item) => (
          <button
            type="button"
            className={page === item.id ? "active" : ""}
            aria-current={page === item.id ? "page" : undefined}
            onClick={() => setPage(item.id)}
            key={item.id}
          >
            <Icon name={item.icon} />
            <span>{item.short}</span>
          </button>
        ))}
        <button
          type="button"
          className={moreTabActive ? "active" : ""}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(true)}
        >
          <Icon name="menu" />
          <span>More</span>
        </button>
      </nav>
      {moreOpen && (
        <div
          className="mp-sheet-backdrop"
          onClick={() => setMoreOpen(false)}
          role="presentation"
        >
          <div
            className="mp-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More"
            onClick={(event) => event.stopPropagation()}
          >
            {moreItems.map((item) => (
              <button
                type="button"
                className={page === item.id ? "active" : ""}
                onClick={() => {
                  setPage(item.id)
                  setMoreOpen(false)
                }}
                key={item.id}
              >
                <Icon name={item.icon} />
                {item.label}
              </button>
            ))}
            <button type="button" onClick={onExit}>
              <Icon name="external" />
              Back to WhitePe
            </button>
          </div>
        </div>
      )}
      {selected && (
        <Receipt
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

export default function MerchantApp() {
  const router = useRouter()
  const onExit = () => router.push("/")
  const [dashboard, setDashboard] = useState(false)
  return dashboard ? (
    <Dashboard onExit={onExit} />
  ) : (
    <Onboarding onComplete={() => setDashboard(true)} onBack={onExit} />
  )
}
