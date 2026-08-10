import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand revalidation after Sanity publish.
 * POST /api/revalidate?secret=YOUR_SECRET
 * GET  /api/revalidate?secret=YOUR_SECRET  (handy while developing)
 */
function authorize(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  // In development, allow without secret so editors can refresh easily
  if (process.env.NODE_ENV === "development" && !expected) return true;
  return Boolean(secret && expected && secret === expected);
}

function revalidateAll() {
  revalidateTag("sanity", "max");
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  revalidateAll();
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  revalidateAll();
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
