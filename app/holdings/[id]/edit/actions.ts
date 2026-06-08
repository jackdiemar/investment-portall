"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { updateInvestmentInSupabase } from "@/lib/supabase";

function stringValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function requiredStringValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key} is required.`);
  return value;
}

function numberValue(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").replace(/,/g, "").trim();
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${key} must be a number.`);
  return value;
}

export async function updateInvestmentAction(id: number, formData: FormData) {
  await requireAdminSession();

  await updateInvestmentInSupabase(id, {
    name: requiredStringValue(formData, "name"),
    category: requiredStringValue(formData, "category"),
    logo: stringValue(formData, "logo"),
    fund_name: stringValue(formData, "fund_name"),
    sector: stringValue(formData, "sector"),
    description: stringValue(formData, "description"),
    website: stringValue(formData, "website"),
    contact_email: stringValue(formData, "contact_email"),
    investment_date: stringValue(formData, "investment_date"),
    amount_committed: numberValue(formData, "amount_committed"),
    amount_called: numberValue(formData, "amount_called"),
    current_value: numberValue(formData, "current_value"),
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/dashboard");
  revalidatePath("/holdings");
  revalidatePath(`/holdings/${id}`);
  redirect(`/holdings/${id}`);
}
