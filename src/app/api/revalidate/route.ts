import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret, path } = body;

  // Verify the revalidation secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    if (path) {
      // Revalidate a specific path
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    } else {
      // Revalidate all pages
      revalidatePath("/");
      revalidatePath("/post/[slug]", "page");
      revalidatePath("/category/[slug]", "page");
      return NextResponse.json({ revalidated: true, path: "all" });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}