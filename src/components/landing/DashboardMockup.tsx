"use client"

import { useState } from "react"
import { TokenChainIcon, ChainIcon, ArchivIcon } from "@/components/ui/crypto-icons"
import { Check } from "./icons"
import { LayoutGrid, DollarSign, Globe, Settings, Search } from "lucide-react"

const TABS = [
  { id: "dashboard", label: "Comprehensive dashboard" },
  { id: "settlement", label: "Instant USDT settlement" },
  { id: "archiv", label: "Archiv receipts" },
  { id: "multichain", label: "Multi-chain routing" },
]

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="solutions-container">
      {/* Sub tabs matching reference image */}
      <div className="solutions-tabs-bar" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`solution-tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main interactive dashboard preview card */}
      <div className="dashboard-window-frame">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-brand">
              <span className="brand-dot" />
              <span>WhitePe Merchant</span>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-item active">
                <LayoutGrid size={16} />
                <span>Dashboard</span>
              </div>
              <div className="nav-item">
                <DollarSign size={16} />
                <span>Payments</span>
              </div>
              <div className="nav-item">
                <ArchivIcon size={16} />
                <span>Archiv Receipts</span>
              </div>
              <div className="nav-item">
                <Globe size={16} />
                <span>Whitechain Node</span>
              </div>
              <div className="nav-item">
                <Settings size={16} />
                <span>Settings</span>
              </div>
            </nav>

            <div className="sidebar-settlement-card">
              <small>Settlement Wallet</small>
              <div className="wallet-balance">
                <strong>48,290.50</strong>
                <span>USDT</span>
              </div>
              <div className="wallet-network">
                <span className="live-dot" /> Whitechain
              </div>
            </div>
          </aside>

          {/* Main Dashboard Screen */}
          <main className="dashboard-main-content">
            <header className="dashboard-top-bar">
              <div className="search-pill">
                <Search size={14} />
                <input type="text" placeholder="Search orders, tx hash, or Archiv proof..." readOnly value="Filter: Last 30 Days" />
              </div>
              <div className="top-bar-actions">
                <span className="badge-chain">
                  <ChainIcon chain="whitechain" size={13} /> Whitechain EVM
                </span>
                <span className="badge-archiv">
                  <ArchivIcon size={13} /> Archiv Synced
                </span>
              </div>
            </header>

            {/* KPI Metrics */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-label">Total Settled Volume</span>
                <div className="kpi-val">$128,450.00 <small>USDT</small></div>
                <div className="kpi-change positive">↑ 14.2% vs last month</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Avg. Settlement Speed</span>
                <div className="kpi-val">0.8 <small>seconds</small></div>
                <div className="kpi-change">Sub-second Whitechain L1/L2</div>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">Archiv Proofs</span>
                <div className="kpi-val">1,429 <small>Records</small></div>
                <div className="kpi-change positive">100% Onchain Verified</div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="table-wrapper">
              <div className="table-head-row">
                <h4>Recent Whitechain Settlements</h4>
                <span>Auto-refreshing (every 2s)</span>
              </div>
              <table className="demo-table">
                <thead>
                  <tr>
                    <th>Order &amp; Merchant</th>
                    <th>Customer Paid</th>
                    <th>Settled Amount</th>
                    <th>Status</th>
                    <th>Archiv Proof</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>WP-84291</strong>
                      <small>Bombay Coffee Co. (Bengaluru)</small>
                    </td>
                    <td>
                      <span className="token-tag">
                        <TokenChainIcon symbol="ETH" chain="arbitrum" size={18} />
                        0.0042 ETH
                      </span>
                    </td>
                    <td>
                      <strong>42.00 USDT</strong>
                      <small>on Whitechain</small>
                    </td>
                    <td>
                      <span className="status-pill completed">
                        <Check small /> Completed
                      </span>
                    </td>
                    <td>
                      <code className="proof-pill">arc_0x8f29c0a1</code>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>WP-84278</strong>
                      <small>Fresh Mart (Mumbai)</small>
                    </td>
                    <td>
                      <span className="token-tag">
                        <TokenChainIcon symbol="USDC" chain="base" size={18} />
                        28.50 USDC
                      </span>
                    </td>
                    <td>
                      <strong>28.42 USDT</strong>
                      <small>on Whitechain</small>
                    </td>
                    <td>
                      <span className="status-pill completed">
                        <Check small /> Completed
                      </span>
                    </td>
                    <td>
                      <code className="proof-pill">arc_0x7b1ac892</code>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>WP-84254</strong>
                      <small>Chaiwala Express (Pune)</small>
                    </td>
                    <td>
                      <span className="token-tag">
                        <TokenChainIcon symbol="WBT" chain="whitechain" size={18} />
                        1.63 WBT
                      </span>
                    </td>
                    <td>
                      <strong>31.75 USDT</strong>
                      <small>on Whitechain</small>
                    </td>
                    <td>
                      <span className="status-pill completed">
                        <Check small /> Completed
                      </span>
                    </td>
                    <td>
                      <code className="proof-pill">arc_0x5c42e19a</code>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <strong>WP-84231</strong>
                      <small>Bombay Hardware Co.</small>
                    </td>
                    <td>
                      <span className="token-tag">
                        <TokenChainIcon symbol="ETH" chain="arbitrum" size={18} />
                        0.0594 ETH
                      </span>
                    </td>
                    <td>
                      <strong>149.00 USDT</strong>
                      <small>on Whitechain</small>
                    </td>
                    <td>
                      <span className="status-pill completed">
                        <Check small /> Completed
                      </span>
                    </td>
                    <td>
                      <code className="proof-pill">arc_0x92bca710</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
