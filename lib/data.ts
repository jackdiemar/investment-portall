import "server-only";

import { fallbackInvestments } from "./fallback-data";
import {
  fetchCashFlowsFromSupabase,
  fetchInvestmentFromSupabase,
  fetchInvestmentsFromSupabase,
  isSupabaseConfigured,
  listStorageDocuments,
  type CashFlow,
  type Investment,
  type StorageDocument,
} from "./supabase";

export type DataResult<T> = {
  data: T;
  source: "supabase" | "fallback";
  error: string | null;
};

export type PortfolioMetrics = {
  committed: number;
  called: number;
  currentValue: number;
  unfunded: number;
  unrealizedGain: number;
  moic: number;
  returnPct: number;
  count: number;
};

export function getInvestmentMetrics(investment: Investment) {
  const moic = investment.amountCalled > 0 ? investment.currentValue / investment.amountCalled : 0;
  const returnPct =
    investment.amountCalled > 0
      ? ((investment.currentValue - investment.amountCalled) / investment.amountCalled) * 100
      : 0;

  return {
    moic,
    returnPct,
    unrealizedGain: investment.currentValue - investment.amountCalled,
    unfunded: Math.max(investment.amountCommitted - investment.amountCalled, 0),
  };
}

export function getPortfolioMetrics(investments: Investment[]): PortfolioMetrics {
  const committed = investments.reduce((sum, investment) => sum + investment.amountCommitted, 0);
  const called = investments.reduce((sum, investment) => sum + investment.amountCalled, 0);
  const currentValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
  const unrealizedGain = currentValue - called;

  return {
    committed,
    called,
    currentValue,
    unfunded: Math.max(committed - called, 0),
    unrealizedGain,
    moic: called > 0 ? currentValue / called : 0,
    returnPct: called > 0 ? (unrealizedGain / called) * 100 : 0,
    count: investments.length,
  };
}

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function mergeInvestmentsWithFallback(supabaseInvestments: Investment[]) {
  if (!supabaseInvestments.length) return fallbackInvestments;

  const supabaseByName = new Map(supabaseInvestments.map((investment) => [normalizeName(investment.name), investment]));
  const fallbackNames = new Set(fallbackInvestments.map((investment) => normalizeName(investment.name)));
  const merged = fallbackInvestments.map((investment) => supabaseByName.get(normalizeName(investment.name)) ?? investment);
  const extras = supabaseInvestments.filter((investment) => !fallbackNames.has(normalizeName(investment.name)));

  return [...merged, ...extras];
}

export async function getInvestments(): Promise<DataResult<Investment[]>> {
  if (!isSupabaseConfigured()) {
    return {
      data: fallbackInvestments,
      source: "fallback",
      error: "Supabase environment variables are not configured. Showing local seed data.",
    };
  }

  try {
    const supabaseInvestments = await fetchInvestmentsFromSupabase();
    return {
      data: mergeInvestmentsWithFallback(supabaseInvestments),
      source: "supabase",
      error: null,
    };
  } catch (error) {
    return {
      data: fallbackInvestments,
      source: "fallback",
      error: error instanceof Error ? error.message : "Supabase request failed. Showing local seed data.",
    };
  }
}

export async function getInvestment(id: number): Promise<DataResult<Investment | null>> {
  if (!isSupabaseConfigured()) {
    return {
      data: fallbackInvestments.find((investment) => investment.id === id) ?? null,
      source: "fallback",
      error: "Supabase environment variables are not configured. Showing local seed data.",
    };
  }

  try {
    const directInvestment = await fetchInvestmentFromSupabase(id);
    if (directInvestment) {
      return {
        data: directInvestment,
        source: "supabase",
        error: null,
      };
    }

    const investments = mergeInvestmentsWithFallback(await fetchInvestmentsFromSupabase());
    return {
      data: investments.find((investment) => investment.id === id) ?? null,
      source: "supabase",
      error: null,
    };
  } catch (error) {
    return {
      data: fallbackInvestments.find((investment) => investment.id === id) ?? null,
      source: "fallback",
      error: error instanceof Error ? error.message : "Supabase request failed. Showing local seed data.",
    };
  }
}

export async function getCashFlows(investmentId: number): Promise<DataResult<CashFlow[]>> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      source: "fallback",
      error: null,
    };
  }

  try {
    return {
      data: await fetchCashFlowsFromSupabase(investmentId),
      source: "supabase",
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      source: "fallback",
      error: error instanceof Error ? error.message : "Supabase cash flow request failed.",
    };
  }
}

export async function getDocuments(bucket: "data-room" | "updates"): Promise<DataResult<StorageDocument[]>> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      source: "fallback",
      error: "Supabase environment variables are not configured.",
    };
  }

  try {
    return {
      data: await listStorageDocuments(bucket),
      source: "supabase",
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      source: "fallback",
      error: error instanceof Error ? error.message : "Supabase storage request failed.",
    };
  }
}
