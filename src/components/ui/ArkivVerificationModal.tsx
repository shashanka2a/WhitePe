"use client"

import { useEffect, useState } from "react"
import { ArchivIcon } from "@/components/ui/crypto-icons"
import type { ArkivVerificationResult } from "@/lib/arkiv"

interface ArkivVerificationModalProps {
  proofId: string | null
  isOpen: boolean
  onClose: () => void
}

export function ArkivVerificationModal({
  proofId,
  isOpen,
  onClose,
}: ArkivVerificationModalProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ArkivVerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<boolean>(false)
  const [copiedJson, setCopiedJson] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen || !proofId) {
      setData(null)
      setError(null)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    fetch(`/api/arkiv/verify/${encodeURIComponent(proofId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to verify receipt (Status: ${res.status})`)
        }
        return res.json()
      })
      .then((json: ArkivVerificationResult) => {
        if (isMounted) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message || "Failed to contact Arkiv network")
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, proofId])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen || !proofId) return null

  const copyEntityKey = () => {
    if (!data?.entityKey) return
    navigator.clipboard?.writeText(data.entityKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const copyFullJson = () => {
    if (!data) return
    navigator.clipboard?.writeText(JSON.stringify(data, null, 2))
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(18, 14, 28, 0.72)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="arkiv-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 25px 60px -15px rgba(24, 18, 48, 0.35), 0 0 0 1px rgba(116, 71, 211, 0.12)",
          overflow: "hidden",
          color: "#18151d",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #1f1438, #371b63)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <ArchivIcon size={22} />
            </div>
            <div>
              <h2
                id="arkiv-modal-title"
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Arkiv Web3 Database
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "#d8c7f8",
                  marginTop: "2px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 8px #22c55e",
                  }}
                />
                <span>Rabdi Testnet (Chain ID 7794095)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#ffffff",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              transition: "background 0.15s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", maxHeight: "calc(85vh - 120px)", overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #f0eafc",
                  borderTopColor: "#7447d3",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p style={{ margin: 0, fontSize: "14px", color: "#6e677c", fontWeight: 500 }}>
                Querying Arkiv entity for <code>{proofId}</code>...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                padding: "20px",
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                borderRadius: "12px",
                color: "#b91c1c",
                fontSize: "14px",
              }}
            >
              <strong>Verification error:</strong> {error}
            </div>
          ) : data ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Status Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 16px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "13px", color: "#14532d" }}>
                    Cryptographically Verified & Tamper-Proof
                  </strong>
                  <span style={{ fontSize: "12px", color: "#166534" }}>
                    Indexed under schema <code style={{ fontWeight: 600 }}>{data.schema}</code> on
                    Arkiv Rabdi.
                  </span>
                </div>
              </div>

              {/* Cryptographic Identifiers */}
              <div
                style={{
                  background: "#faf8fc",
                  border: "1px solid #ede8f5",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#746e82", fontWeight: 500 }}>Arkiv Proof ID</span>
                  <code
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontWeight: 600,
                      color: "#5e329f",
                      background: "#eedefa",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {data.proofId}
                  </code>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#746e82", fontWeight: 500 }}>Arkiv Entity Key</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <code
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        color: "#272230",
                        fontSize: "11px",
                      }}
                      title={data.entityKey}
                    >
                      {data.entityKey.slice(0, 10)}...{data.entityKey.slice(-8)}
                    </code>
                    <button
                      onClick={copyEntityKey}
                      type="button"
                      style={{
                        background: copiedKey ? "#22c55e" : "#e9e3f5",
                        color: copiedKey ? "#ffffff" : "#4a2a82",
                        border: "none",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.15s",
                      }}
                    >
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#746e82", fontWeight: 500 }}>Retention Period</span>
                  <span style={{ color: "#272230", fontWeight: 600 }}>365 Days (Arkiv Protocol)</span>
                </div>
              </div>

              {/* Indexed Receipt Data */}
              <div>
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "#5b5468",
                  }}
                >
                  Indexed Receipt Payload
                </h4>
                <div
                  style={{
                    border: "1px solid #e7e2ef",
                    borderRadius: "12px",
                    overflow: "hidden",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr",
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0ecf6",
                      background: "#ffffff",
                    }}
                  >
                    <span style={{ color: "#746e82" }}>Payment ID</span>
                    <strong style={{ color: "#18151d" }}>{data.receipt.paymentId}</strong>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr",
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0ecf6",
                      background: "#faf9fd",
                    }}
                  >
                    <span style={{ color: "#746e82" }}>Merchant</span>
                    <span style={{ color: "#18151d" }}>
                      <strong>{data.receipt.merchantName}</strong> ({data.receipt.merchantUpi})
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr",
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0ecf6",
                      background: "#ffffff",
                    }}
                  >
                    <span style={{ color: "#746e82" }}>Whitechain Settlement</span>
                    <span style={{ color: "#18151d" }}>
                      <strong style={{ color: "#15803d" }}>
                        {data.receipt.amountUsdt} USDT
                      </strong>{" "}
                      (₹{data.receipt.amountInr})
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr",
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0ecf6",
                      background: "#faf9fd",
                    }}
                  >
                    <span style={{ color: "#746e82" }}>Customer Paid</span>
                    <span style={{ color: "#18151d" }}>
                      {data.receipt.paidWith} via {data.receipt.paidChain}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr",
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0ecf6",
                      background: "#ffffff",
                    }}
                  >
                    <span style={{ color: "#746e82" }}>Merchant Wallet</span>
                    <code
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        color: "#443e52",
                        wordBreak: "break-all",
                        fontSize: "11px",
                      }}
                    >
                      {data.receipt.merchantWallet}
                    </code>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr",
                      padding: "10px 14px",
                      background: "#faf9fd",
                    }}
                  >
                    <span style={{ color: "#746e82" }}>Whitechain Tx</span>
                    <a
                      href={`https://explorer.whitechain.io/tx/${data.receipt.whitechainTxHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "#7447d3",
                        textDecoration: "underline",
                        wordBreak: "break-all",
                        fontSize: "11px",
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      {data.receipt.whitechainTxHash} ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  paddingTop: "6px",
                }}
              >
                <a
                  href={`${data.explorerUrl}/address/${data.entityKey}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px 16px",
                    background: "#181ea9",
                    color: "#ffffff",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  <ArchivIcon size={14} /> View on Explorer ↗
                </a>

                <button
                  type="button"
                  onClick={copyFullJson}
                  style={{
                    padding: "10px 16px",
                    background: "#f3eefa",
                    border: "1px solid #dfd4f2",
                    color: "#56318d",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {copiedJson ? "✓ Copied JSON" : "Copy JSON Proof"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
