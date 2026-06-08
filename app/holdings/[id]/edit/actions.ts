"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveInvestmentInSupabase } from "@/lib/supabase";

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
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return 0;

  const cleaned = raw
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .toLowerCase();

  const multiplier = cleaned.endsWith("m") ? 1_000_000 : cleaned.endsWith("k") ? 1_000 : 1;
  const numericText = cleaned.replace(/[mk]$/, "");
  const value = Number(numericText) * multiplier;
  if (!Number.isFinite(value)) return 0;
  return value;
}

export async function updateInvestmentAction(id: number, formData: FormData) {
  const savedInvestment = await saveInvestmentInSupabase(id, {
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
  if (savedInvestment) revalidatePath(`/holdings/${savedInvestment.id}`);
  redirect(`/holdings/${savedInvestment?.id ?? id}`);
}
