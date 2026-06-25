import { NextRequest, NextResponse } from "next/server"
import { successResponse } from "@/lib/api"

async function POST(request: NextRequest) {
  return successResponse({ message: "Logged out successfully" })
}

export { POST }
export default { POST }
