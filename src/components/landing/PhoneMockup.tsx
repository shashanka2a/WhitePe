import { Check } from "./icons"
import { Logo } from "./Logo"
import { TokenIcon } from "@/components/ui/crypto-icons"

function MiniQr() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-label="Merchant QR code preview">
      <rect width="80" height="80" rx="8" fill="white" />
      <g fill="#15121B">
        <path
          d="M8 8h20v20H8V8Zm4 4v12h12V12H12ZM52 8h20v20H52V8Zm4 4v12h12V12H56ZM8 52h20v20H8V52Zm4 4v12h12V56H12Z"
          fillRule="evenodd"
        />
        <path d="M34 8h6v6h-6zm8 0h6v12h-6zm-8 10h6v10h-6zm0 16h8v8h-8zm12-6h8v8h-8zm12 4h6v6h-6zm8 0h6v14h-6zm-32 14h6v8h-6zm10-6h8v8h-8zm12 4h6v8h-6zm-22 14h12v6H34zm16-4h8v8h-8zm12 2h10v6H62zm-28 10h8v6h-8zm14 2h8v4h-8zm12-2h12v6H60z" />
      </g>
      <rect x="31" y="31" width="18" height="18" rx="5" fill="#7D49F8" />
      <path d="m40 35 5 5-5 5-5-5 5-5Z" fill="white" />
    </svg>
  )
}

export function PhoneMockup() {
  return (
    <div className="phone-stage" aria-label="WhitePe mobile payment preview">
      <div className="phone-shell">
        <div className="phone-screen">
          <div className="phone-status">
            <span>9:41</span>
            <span className="phone-island" />
            <span>● ◒</span>
          </div>
          <div className="phone-top">
            <span className="mini-logo">
              <Logo decorative />
            </span>
            <span className="profile-dot">AK</span>
          </div>
          <div className="phone-copy">
            <span>Paying to</span>
            <h3>Bombay Coffee Co.</h3>
            <p>Verified merchant</p>
          </div>
          <div className="qr-window">
            <div className="scanner-corners">
              <MiniQr />
              <span className="scan-line" />
            </div>
          </div>
          <div className="payment-sheet">
            <div className="sheet-handle" />
            <div className="amount-row">
              <span>Amount</span>
              <strong>₹1,250</strong>
            </div>
            <div className="pay-token">
              <TokenIcon symbol="WBT" size={27} />
              <div>
                <span>Pay with</span>
                <strong>0.75 WBT</strong>
              </div>
              <span className="chevron">⌄</span>
            </div>
            <div className="confirm-payment">
              <Check small />
              <span>Payment confirmed</span>
            </div>
          </div>
        </div>
      </div>
      <div className="float-card success-card">
        <span className="success-check">
          <Check />
        </span>
        <div>
          <strong>Payment complete</strong>
          <span>Settled in USDT on Whitechain · Stored on Archiv</span>
        </div>
      </div>
    </div>
  )
}
