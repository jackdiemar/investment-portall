import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { createSignedDownloadUrl } from "@/lib/supabase";

export async function GET(request: Request) {
  await requireSession();

  const url = new URL(request.url);
  const bucket = url.searchParams.get("bucket");
  const name = url.searchParams.get("name");

  if ((bucket !== "data-room" && bucket !== "updates") || !name) {
    return NextResponse.json({ error: "Invalid download request." }, { status: 400 });
  }

  try {
    const signedUrl = await createSignedDownloadUrl(bucket, name);
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create download link." },
      { status: 500 }
    );
  }
}
