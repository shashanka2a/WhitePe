import { NextRequest, NextResponse } from "next/server"
import { verifyArkivReceipt } from "@/lib/arkiv"

export async function GET(
  _req: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const params = await segmentData.params
    const proofId = params.id

    if (!proofId) {
      return NextResponse.json({ error: "Proof ID parameter is required" }, { status: 400 })
    }

    const verification = await verifyArkivReceipt(proofId)

    if (!verification) {
      return NextResponse.json(
        { verified: false, error: "Receipt not found or invalid proof signature" },
        { status: 404 }
      )
    }

    return NextResponse.json(verification, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to verify Arkiv receipt"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

