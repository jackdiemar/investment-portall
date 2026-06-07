"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { uploadStorageDocument } from "@/lib/supabase";

export async function uploadDataRoomDocument(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/data-room?upload=missing");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._ -]/g, "").trim();
  const datedPath = `${new Date().toISOString().slice(0, 10)}/${safeName || "document"}`;

  try {
    await uploadStorageDocument("data-room", datedPath, file);
  } catch {
    redirect("/data-room?upload=failed");
  }

  revalidatePath("/data-room");
  redirect("/data-room?upload=success");
}
