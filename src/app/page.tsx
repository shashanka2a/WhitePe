import Link from "next/link"
import { Logo } from "@/components/landing/Logo"
import { MobileMenu } from "@/components/landing/MobileMenu"
import { HeroMockup } from "@/components/landing/HeroMockup"
import { DashboardMockup } from "@/components/landing/DashboardMockup"
import { IntegrationHub } from "@/components/landing/IntegrationHub"
import { TokenIcon, TokenChainIcon, ChainIcon, ArchivIcon } from "@/components/ui/crypto-icons"
import { Check, ArrowUpRight, ArrowRight } from "@/components/landing/icons"
import { ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="site-shell">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="nav-inner">
          <Logo />
          <nav aria-label="Main navigation" className="desktop-nav">
            <a href="#solutions">Solutions</a>
            <a href="#integrations">Integrations</a>
            <a href="#features">Features</a>
            <a href="#merchants">For Merchants</a>
            <a href="#shoppers">For Shoppers</a>
          </nav>
          <div className="nav-actions">
            <Link className="merchant-link-btn" href="/merchant">
              Merchant Portal
            </Link>
            <Link className="wallet-button" href="/app">
              <span className="wallet-dot" />
              Launch App
            </Link>
            <MobileMenu />
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Hero */}
        <section className="hero">
          <div className="hero-radial-bg" aria-hidden="true" />
          <div className="container hero-container">
            <h1 className="hero-headline fade-up delay-one">
              Revolutionize Your Business with{" "}
              <span className="hero-gradient-text">USDT on Whitechain</span>
            </h1>

            <p className="hero-subtext fade-up delay-two">
              Accept crypto payments from any customer. Settle instantly with zero volatility
              in <strong>USDT on Whitechain</strong>, with tamper-proof receipts on <strong>Archiv</strong>.
            </p>

            <div className="hero-action-row fade-up delay-three">
              <Link className="btn-primary-pill" href="/merchant">
                Get started
              </Link>
              <Link className="btn-secondary-pill" href="/app">
                Start Paying
              </Link>
            </div>

            <div className="hero-trust-bar fade-up delay-three">
              <div className="trust-item">
                <ChainIcon chain="whitechain" size={18} />
                <span>Settled on <strong>Whitechain</strong></span>
              </div>
              <span className="trust-sep">·</span>
              <div className="trust-item">
                <ArchivIcon size={18} />
                <span>Verified on <strong>Archiv</strong></span>
              </div>
              <span className="trust-sep">·</span>
              <div className="trust-item">
                <TokenIcon symbol="USDT" size={18} />
                <span>Zero Volatility <strong>USDT</strong></span>
              </div>
            </div>

            {/* Hero Browser Mockup from reference image */}
            <div className="hero-mockup-wrapper fade-up delay-three">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* Section 2: Solutions and Tools */}
        <section className="section solutions-section" id="solutions">
          <div className="container">
            <div className="section-header-centered">
              <span className="section-pill-kicker">SOLUTIONS AND TOOLS</span>
              <h2 className="section-title-serif">
                Everything you need to manage crypto settlement
              </h2>
              <p className="section-subtitle">
                Accept payments globally, settle in USDT on Whitechain, and verify receipts on Archiv.
              </p>
            </div>

            <DashboardMockup />
          </div>
        </section>

        {/* Section 3: Integrations */}
        <section className="section integrations-section" id="integrations">
          <div className="container integration-grid">
            <div className="integration-copy">
              <span className="section-pill-kicker">INTEGRATIONS</span>
              <h2 className="section-title-serif">
                Supercharge your store with native integrations
              </h2>
              <p>
                Seamlessly connect WhitePe to your existing merchant UPI QR code, Shopify store,
                WooCommerce checkout, or custom developer API.
              </p>
              <p>
                Instant conversion and settlement in <strong>USDT on Whitechain</strong> with
                cryptographic proofs on <strong>Archiv</strong>.
              </p>

              <div className="integration-bullets">
                <div className="int-bullet">
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>30-second setup for existing UPI QR codes</span>
                </div>
                <div className="int-bullet">
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Direct settlement to self-custody Whitechain wallets</span>
                </div>
                <div className="int-bullet">
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Zero chargebacks, zero chargeback fees</span>
                </div>
              </div>

              <div className="integration-cta">
                <Link className="btn-secondary-pill with-arrow" href="/merchant">
                  Explore merchant integrations <ArrowRight />
                </Link>
              </div>
            </div>

            <div className="integration-visual-col">
              <IntegrationHub />
            </div>
          </div>
        </section>

        {/* Section 4: Features Bento Grid */}
        <section className="section features-section" id="features">
          <div className="container">
            <div className="section-header-centered">
              <span className="section-pill-kicker">FEATURES &amp; CAPABILITIES</span>
              <h2 className="section-title-serif">
                Built for speed and cryptographic certainty
              </h2>
              <p className="section-subtitle">
                Zero volatility USDT settlement on Whitechain with permanent receipts on Archiv.
              </p>
            </div>

            <div className="bento-grid">
              {/* Bento Card 1 */}
              <article className="bento-card">
                <div className="bento-text">
                  <h3>Accept Any Token Across Chains</h3>
                  <p>
                    Shoppers pay with WBT, ETH, BTC, USDC, or USDT. Automated routing via LI.FI bridges and swaps directly to USDT on Whitechain.
                  </p>
                </div>
                <div className="bento-visual token-picker-visual">
                  <div className="token-row active">
                    <TokenChainIcon symbol="USDT" chain="whitechain" size={24} />
                    <div>
                      <strong>USDT</strong>
                      <small>Whitechain Mainnet</small>
                    </div>
                    <span className="rate-badge">1:1 Settle</span>
                  </div>
                  <div className="token-row">
                    <TokenChainIcon symbol="WBT" chain="whitechain" size={24} />
                    <div>
                      <strong>WBT</strong>
                      <small>Whitechain Native</small>
                    </div>
                    <span className="rate-badge">19.50 USDT</span>
                  </div>
                  <div className="token-row">
                    <TokenChainIcon symbol="ETH" chain="arbitrum" size={24} />
                    <div>
                      <strong>ETH</strong>
                      <small>Arbitrum / L2</small>
                    </div>
                    <span className="rate-badge">2,508 USDT</span>
                  </div>
                </div>
              </article>

              {/* Bento Card 2 - matching reference image 4a860476 */}
              <article className="bento-card">
                <div className="bento-text">
                  <h3>Tamper-Proof Receipts on Archiv</h3>
                  <p>
                    Every transaction generates a cryptographic proof permanently archived on the decentralized Archiv data layer.
                  </p>
                </div>
                <div className="bento-visual archiv-proof-visual">
                  <div className="proof-card-box">
                    <div className="proof-card-header">
                      <ShieldCheck size={28} className="proof-shield-icon" />
                      <div className="proof-id-meta">
                        <span className="proof-kicker-label">ARCHIV PROOF ID</span>
                        <code className="proof-code-val">arc_0x8f29c0a10b42</code>
                      </div>
                    </div>
                    <div className="proof-status-row">
                      <span className="proof-live-dot" />
                      <span>Immutable &amp; Tamper-Proof</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Bento Card 3: Wide Card across bottom */}
              <article className="bento-card bento-card-wide">
                <div className="bento-wide-copy">
                  <h3>Fast &amp; Frictionless Checkout</h3>
                  <p>
                    Provide your shoppers with a native, one-click payment experience. Settlements complete in under 0.8s directly into USDT on Whitechain with permanent receipts on Archiv.
                  </p>
                  <div className="bento-pills-row">
                    <span className="bento-micro-pill">
                      <span className="pill-dot green" /> 0.8s Latency
                    </span>
                    <span className="bento-micro-pill">
                      <span className="pill-dot purple" /> Zero Volatility
                    </span>
                    <span className="bento-micro-pill">
                      <span className="pill-dot blue" /> Archiv Verified
                    </span>
                  </div>
                </div>
                <div className="bento-visual settlement-visual-card">
                  <div className="settle-notice">
                    <span className="settle-check">✓</span>
                    <div>
                      <strong>+149.00 USDT Received</strong>
                      <small>Settled on Whitechain · Verified on Archiv</small>
                    </div>
                  </div>
                  <div className="mini-receipt-details">
                    <div className="receipt-line">
                      <span>Order WP-84231</span>
                      <span>Customer: 7.64 WBT</span>
                    </div>
                    <div className="receipt-line">
                      <span>Proof ID</span>
                      <code>arc_0x92bca710</code>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Section 5: Split Comparison (Shop Owners vs Shoppers) */}
        <section className="section split-comparison-section" id="merchants">
          <div className="container split-grid">
            {/* Left Card: Shop Owners */}
            <div className="split-card merchant-card">
              <span className="split-kicker">FOR SHOP OWNERS</span>
              <h3 className="split-title">Trusted by Shop Owners</h3>
              <ul className="split-checklist">
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Zero chargebacks &amp; complete fraud immunity</span>
                </li>
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Direct USDT settlement on Whitechain into your self-custody wallet</span>
                </li>
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Link existing merchant UPI QR or checkout in under 60 seconds</span>
                </li>
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Permanent tax-compliant &amp; verifiable receipts on Archiv</span>
                </li>
              </ul>
              <div className="split-cta">
                <Link className="btn-dark-pill" href="/merchant">
                  Join as Merchant →
                </Link>
              </div>

              {/* Merchant POS Preview Thumbnail */}
              <div className="split-preview-box">
                <div className="mini-pos-head">
                  <span className="avatar-pill">BC</span>
                  <div>
                    <strong>Bombay Coffee Co.</strong>
                    <small>Active Merchant · Whitechain</small>
                  </div>
                  <span className="active-tag">Active</span>
                </div>
                <div className="mini-preview-bottom">
                  <div className="mini-pos-kpi">
                    <span>Today&apos;s USDT Settlements</span>
                    <strong>$1,842.50 <small>USDT</small></strong>
                  </div>
                  <div className="mini-db-tag">
                    <ArchivIcon size={14} />
                    <span>Archiv Synced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Shoppers */}
            <div className="split-card shopper-card" id="shoppers">
              <span className="split-kicker shopper">FOR SHOPPERS</span>
              <h3 className="split-title">Shoppers&apos; Choice</h3>
              <ul className="split-checklist">
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Scan any UPI QR or checkout with the crypto you already hold</span>
                </li>
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Frictionless login: instant embedded wallet or MetaMask</span>
                </li>
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Sub-cent gas fees powered by high-speed Whitechain</span>
                </li>
                <li>
                  <span className="checklist-bullet-badge">
                    <Check size={12} />
                  </span>
                  <span>Verifiable immutable receipt on Archiv for every spend</span>
                </li>
              </ul>
              <div className="split-cta">
                <Link className="btn-dark-pill" href="/app">
                  Start Paying →
                </Link>
              </div>

              {/* Shopper Mobile Preview Thumbnail */}
              <div className="split-preview-box shopper-box">
                <div className="mini-pos-head">
                  <TokenChainIcon symbol="WBT" chain="whitechain" size={32} />
                  <div>
                    <strong>Paid 7.64 WBT</strong>
                    <small>Settled as 149.00 USDT on Whitechain</small>
                  </div>
                  <span className="active-tag">Complete</span>
                </div>
                <div className="mini-preview-bottom">
                  <div className="mini-pos-kpi">
                    <span>Archiv Receipt</span>
                    <code>arc_0x7b2f4891</code>
                  </div>
                  <div className="mini-db-tag">
                    <ArchivIcon size={14} />
                    <span>Verified Proof</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Dark CTA Section */}
        <section className="section cta-dark-section">
          <div className="container">
            <div className="dark-cta-card">
              <div className="dark-cta-content">
                <h2>Experience USDT Settlement on Whitechain</h2>
                <p>
                  Test the live crypto checkout with zero volatility in USDT and permanent receipts on Archiv. Built for frictionless Web3 commerce.
                </p>
                <div className="dark-cta-actions">
                  <Link className="btn-primary-white" href="/app">
                    Launch Consumer App
                  </Link>
                  <Link className="btn-outline-white" href="/merchant">
                    Open Merchant Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Section 8: Footer */}
      <footer className="site-footer">
        <div className="container footer-top-row">
          <div className="footer-brand-col">
            <Logo />
            <p>Simplify payments with USDT on Whitechain and permanent receipts on Archiv.</p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h5>Products</h5>
              <Link href="/app">Crypto Checkout</Link>
              <Link href="/merchant">UPI QR Gateway</Link>
              <a href="#solutions">Whitechain Router</a>
              <a href="#features">Archiv Proofs</a>
            </div>

            <div className="footer-col">
              <h5>Solutions</h5>
              <a href="#merchants">E-Commerce Stores</a>
              <a href="#merchants">Retail Merchants</a>
              <a href="#merchants">Global Invoicing</a>
              <a href="#merchants">Cross-Border Pay</a>
            </div>

            <div className="footer-col">
              <h5>Developers</h5>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Smart Contracts</a>
              <a href="#">GitHub <ArrowUpRight /></a>
            </div>

            <div className="footer-col">
              <h5>Ecosystem</h5>
              <a href="https://explorer.whitechain.io" target="_blank" rel="noreferrer">Whitechain Explorer <ArrowUpRight /></a>
              <a href="https://li.fi" target="_blank" rel="noreferrer">LI.FI Bridge <ArrowUpRight /></a>
              <a href="https://arkiv.network" target="_blank" rel="noreferrer">Archiv Network <ArrowUpRight /></a>
              <a href="#">WhiteBIT (WBT)</a>
              <a href="#">Tether (USDT)</a>
            </div>

            <div className="footer-col">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Security</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="container footer-bottom-row">
          <span>© {new Date().getFullYear()} WhitePe. All rights reserved.</span>
          <span>Settled in USDT on Whitechain · Verified on Archiv</span>
        </div>
      </footer>
    </div>
  )
}
