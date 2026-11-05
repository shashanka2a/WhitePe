"use client"

import { ChainIcon, TokenIcon, ArchivIcon } from "@/components/ui/crypto-icons"
import { QrCode, ShoppingBag, Wallet } from "lucide-react"

export function IntegrationHub() {
  return (
    <div className="integration-hub-frame">
      <div className="hub-center-node">
        <div className="hub-glow-ring" />
        <div className="hub-core">
          <span className="hub-logo-mark">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
              <path d="M16 3.5 28.5 16 16 28.5 3.5 16 16 3.5Z" fill="#7048cf" />
              <path d="M10.25 18.2 16 11.8l5.75 6.4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>WhitePe</strong>
        </div>
      </div>

      {/* Satellite Integration Nodes */}
      <div className="hub-satellites">
        <div className="sat-node sat-top-left">
          <div className="sat-icon upi-color">
            <QrCode size={20} className="text-white" />
          </div>
          <span>UPI QR Standard</span>
        </div>

        <div className="sat-node sat-top-right">
          <div className="sat-icon shopify-color">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <span>Shopify Plugin</span>
        </div>

        <div className="sat-node sat-mid-left">
          <div className="sat-icon wc-color">
            <ChainIcon chain="whitechain" size={24} />
          </div>
          <span>Whitechain L1/L2</span>
        </div>

        <div className="sat-node sat-mid-right">
          <div className="sat-icon usdt-color">
            <TokenIcon symbol="USDT" size={24} />
          </div>
          <span>USDT Settlement</span>
        </div>

        <div className="sat-node sat-bot-left">
          <div className="sat-icon archiv-color">
            <ArchivIcon size={24} />
          </div>
          <span>Archiv Proofs</span>
        </div>

        <div className="sat-node sat-bot-right">
          <div className="sat-icon metamask-color">
            <Wallet size={20} className="text-white" />
          </div>
          <span>Web3 Wallets</span>
        </div>
      </div>

      {/* SVG Connection Lines */}
      <svg className="hub-lines-svg" viewBox="0 0 500 400" fill="none">
        <path d="M 120 70 Q 200 120 250 200" stroke="#d5c8ed" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 380 70 Q 300 120 250 200" stroke="#d5c8ed" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 90 200 L 250 200" stroke="#d5c8ed" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 410 200 L 250 200" stroke="#d5c8ed" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 120 330 Q 200 280 250 200" stroke="#d5c8ed" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 380 330 Q 300 280 250 200" stroke="#d5c8ed" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    </div>
  )
}
