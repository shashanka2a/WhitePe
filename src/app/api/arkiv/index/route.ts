import { NextRequest, NextResponse } from "next/server"
import { indexPaymentOnArkiv, ArkivReceiptRecord } from "@/lib/arkiv"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      paymentId,
      merchantUpi,
      merchantName,
      merchantWallet,
      payer,
      amountUsdt,
      amountInr,
      paidWith,
      paidChain,
      whitechainTxHash,
      archivProof,
      timestamp,
    } = body

    if (!paymentId || !archivProof) {
      return NextResponse.json(
        { error: "paymentId and archivProof are required" },
        { status: 400 }
      )
    }

    const receipt: ArkivReceiptRecord = {
      paymentId: String(paymentId),
      merchantUpi: String(merchantUpi || "merchant@whitepe"),
      merchantName: String(merchantName || "Verified Merchant"),
      merchantWallet: String(merchantWallet || "0x8B42C5e829dE41A19F89738c1a21D6439b7A71F3"),
      payer: String(payer || "0x3FA1c2D84e0B9a57C61d4E8bF20A7D9c15E39C20"),
      amountUsdt: String(amountUsdt || "0.00"),
      amountInr: String(amountInr || "0.00"),
      paidWith: String(paidWith || "USDT"),
      paidChain: String(paidChain || "Whitechain"),
      whitechainTxHash: String(whitechainTxHash || "0x"),
      archivProof: String(archivProof),
      timestamp: String(timestamp || new Date().toISOString()),
    }

    const result = await indexPaymentOnArkiv(receipt)

    return NextResponse.json({
      success: true,
      proofId: result.proofId,
      entityKey: result.entityKey,
      txHash: result.txHash,
      network: "Arkiv Rabdi Testnet",
      chainId: 7794095,
      schema: "whitepe.receipts",
      explorerUrl: result.explorerUrl,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to index receipt on Arkiv"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

