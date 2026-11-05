"use client"

import { useState } from "react"
import { TokenIcon, TokenChainIcon, ArchivIcon } from "@/components/ui/crypto-icons"
import { Check } from "./icons"
import { Lock } from "lucide-react"
import {
  LedgerIllustration,
  TerminalIllustration,
  SmartCardIllustration,
} from "./product-illustrations"

export function HeroMockup() {
  const [selectedToken, setSelectedToken] = useState<"WBT" | "USDT" | "ETH">("WBT")
  const [paid, setPaid] = useState(false)

  const tokenAmounts = {
    WBT: "7.64 WBT",
    USDT: "149.00 USDT",
    ETH: "0.0594 ETH",
  }

  return (
    <div className="hero-browser-shell" aria-label="WhitePe checkout interface preview">
      <div className="browser-header">
        <div className="browser-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="browser-url">
          <Lock size={13} strokeWidth={2.2} />
          <span>whitepe.me/store/checkout</span>
        </div>
        <div className="browser-status">
          <span className="live-pulse" /> Whitechain Mainnet
        </div>
      </div>

      <div className="browser-body">
        {/* Store items catalog */}
        <div className="store-catalog">
          <div className="store-header">
            <div>
              <h3>Bombay Hardware Co.</h3>
              <p>Official Store · UPI: bombaycoffee@okaxis</p>
            </div>
            <span className="store-badge">Verified Merchant</span>
          </div>

          <div className="store-grid">
            <div className="product-card active">
              <div className="product-img">
                <span className="product-tag">Selected</span>
                <div className="hardware-svg-wrap">
                  <LedgerIllustration />
                </div>
              </div>
              <div className="product-details">
                <h4>Ledger Nano X</h4>
                <p>Hardware Cryptowallet</p>
                <strong>149.00 USDT</strong>
              </div>
            </div>

            <div className="product-card">
              <div className="product-img">
                <div className="hardware-svg-wrap">
                  <TerminalIllustration />
                </div>
              </div>
              <div className="product-details">
                <h4>WhitePe Smart Terminal</h4>
                <p>NFC &amp; UPI QR Stand</p>
                <strong>249.00 USDT</strong>
              </div>
            </div>

            <div className="product-card">
              <div className="product-img">
                <div className="hardware-svg-wrap">
                  <SmartCardIllustration />
                </div>
              </div>
              <div className="product-details">
                <h4>Smart Card Reader</h4>
                <p>Contactless Reader</p>
                <strong>89.00 USDT</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Checkout & Settlement Sheet */}
        <div className="checkout-overlay">
          <div className="checkout-card">
            <div className="checkout-top">
              <div>
                <span className="kicker-pill">WhitePe Direct Pay</span>
                <h4>Instant Checkout</h4>
              </div>
              <span className="live-settle-badge">
                <TokenChainIcon symbol="USDT" chain="whitechain" size={20} />
                USDT Settlement
              </span>
            </div>

            <div className="checkout-amount-row">
              <div>
                <small>Amount to Settle</small>
                <strong>149.00 <span className="currency">USDT</span></strong>
              </div>
              <div className="fiat-sub">≈ ₹13,186.50 INR</div>
            </div>

            <div className="token-selector-box">
              <label>Select payment token</label>
              <div className="token-pills">
                <button
                  type="button"
                  className={selectedToken === "WBT" ? "active" : ""}
                  onClick={() => setSelectedToken("WBT")}
                >
                  <TokenIcon symbol="WBT" size={18} />
                  <span>WBT</span>
                  <small>Whitechain</small>
                </button>
                <button
                  type="button"
                  className={selectedToken === "USDT" ? "active" : ""}
                  onClick={() => setSelectedToken("USDT")}
                >
                  <TokenIcon symbol="USDT" size={18} />
                  <span>USDT</span>
                  <small>Direct</small>
                </button>
                <button
                  type="button"
                  className={selectedToken === "ETH" ? "active" : ""}
                  onClick={() => setSelectedToken("ETH")}
                >
                  <TokenIcon symbol="ETH" size={18} />
                  <span>ETH</span>
                  <small>Arbitrum</small>
                </button>
              </div>
            </div>

            <div className="settlement-route-box">
              <div className="route-hop">
                <span>You pay</span>
                <strong>{tokenAmounts[selectedToken]}</strong>
              </div>
              <span className="route-arrow">→</span>
              <div className="route-hop">
                <span>Merchant receives</span>
                <strong>149.00 USDT</strong>
              </div>
            </div>

            <button
              type="button"
              className={`checkout-btn ${paid ? "paid" : ""}`}
              onClick={() => setPaid(!paid)}
            >
              {paid ? (
                <>
                  <Check small /> Payment Settled in 0.8s
                </>
              ) : (
                <>Pay with {selectedToken} →</>
              )}
            </button>

            <div className="checkout-archiv-footer">
              <ArchivIcon size={14} />
              <span>Decentralized Proof: <code>arc_0x8f29c0a10b42</code></span>
              <span className="archiv-verified">Verified on Archiv</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

