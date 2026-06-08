import "server-only";

export type InvestmentRow = {
  id: number;
  name: string;
  category: string;
  logo: string | null;
  fund_name: string | null;
  sector: string | null;
  description: string | null;
  website: string | null;
  contact_email: string | null;
  investment_date: string | null;
  amount_committed: number | string;
  amount_called: number | string;
  current_value: number | string;
  created_at: string | null;
  updated_at: string | null;
};

export type CashFlowRow = {
  id: number;
  investment_id: number;
  flow_date: string;
  flow_type: string;
  amount: number | string;
};

export type Investment = {
  id: number;
  name: string;
  category: string;
  logo: string | null;
  fundName: string | null;
  sector: string | null;
  description: string | null;
  website: string | null;
  contactEmail: string | null;
  investmentDate: string | null;
  amountCommitted: number;
  amountCalled: number;
  currentValue: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type InvestmentUpdate = {
  name: string;
  category: string;
  logo: string | null;
  fund_name: string | null;
  sector: string | null;
  description: string | null;
  website: string | null;
  contact_email: string | null;
  investment_date: string | null;
  amount_committed: number;
  amount_called: number;
  current_value: number;
  updated_at: string;
};

export type CashFlow = {
  id: number;
  investmentId: number;
  flowDate: string;
  flowType: string;
  amount: number;
};

export type StorageDocument = {
  name: string;
  path: string;
  createdAt: string | null;
  updatedAt: string | null;
  size: number;
  mimeType: string | null;
};

type StorageObjectRow = {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
    mimeType?: string;
  } | null;
};

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

export function isSupabaseConfigured() {
  return Boolean(getConfig());
}

async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getConfig();
  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${config.url}${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase request failed with status ${response.status}.`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

export function mapInvestment(row: InvestmentRow): Investment {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    logo: row.logo,
    fundName: row.fund_name,
    sector: row.sector,
    description: row.description,
    website: row.website,
    contactEmail: row.contact_email,
    investmentDate: row.investment_date,
    amountCommitted: toNumber(row.amount_committed),
    amountCalled: toNumber(row.amount_called),
    currentValue: toNumber(row.current_value),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCashFlow(row: CashFlowRow): CashFlow {
  return {
    id: row.id,
    investmentId: row.investment_id,
    flowDate: row.flow_date,
    flowType: row.flow_type,
    amount: toNumber(row.amount),
  };
}

export async function fetchInvestmentsFromSupabase() {
  const params = new URLSearchParams({
    select: "*",
    order: "name.asc",
  });
  const rows = await supabaseFetch<InvestmentRow[]>(`/rest/v1/investments?${params.toString()}`);
  return rows.map(mapInvestment);
}

export async function fetchInvestmentFromSupabase(id: number) {
  const params = new URLSearchParams({
    select: "*",
    id: `eq.${id}`,
    limit: "1",
  });
  const rows = await supabaseFetch<InvestmentRow[]>(`/rest/v1/investments?${params.toString()}`);
  return rows[0] ? mapInvestment(rows[0]) : null;
}

export async function fetchCashFlowsFromSupabase(investmentId: number) {
  const params = new URLSearchParams({
    select: "*",
    investment_id: `eq.${investmentId}`,
    order: "flow_date.desc",
  });
  const rows = await supabaseFetch<CashFlowRow[]>(`/rest/v1/cash_flows?${params.toString()}`);
  return rows.map(mapCashFlow);
}

export async function updateInvestmentInSupabase(id: number, investment: InvestmentUpdate) {
  const params = new URLSearchParams({
    id: `eq.${id}`,
    select: "*",
  });
  const rows = await supabaseFetch<InvestmentRow[]>(`/rest/v1/investments?${params.toString()}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(investment),
  });

  return rows[0] ? mapInvestment(rows[0]) : null;
}

export async function listStorageDocuments(bucket: "data-room" | "updates") {
  const rows = await supabaseFetch<StorageObjectRow[]>(`/storage/v1/object/list/${bucket}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    }),
  });

  return rows
    .filter((row) => row.name !== ".emptyFolderPlaceholder")
    .map<StorageDocument>((row) => ({
      name: row.name.split("/").pop() || row.name,
      path: row.name,
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
      size: row.metadata?.size ?? 0,
      mimeType: row.metadata?.mimetype ?? row.metadata?.mimeType ?? null,
    }))
    .sort((a, b) => {
      const aDate = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
      const bDate = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
      return bDate - aDate;
    });
}

export async function uploadStorageDocument(bucket: "data-room", path: string, file: File) {
  await supabaseFetch(`/storage/v1/object/${bucket}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });
}

export async function createSignedDownloadUrl(bucket: "data-room" | "updates", path: string) {
  const config = getConfig();
  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await supabaseFetch<{ signedURL: string }>(
    `/storage/v1/object/sign/${bucket}/${encodeStoragePath(path)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 60 }),
    }
  );

  return response.signedURL.startsWith("http")
    ? response.signedURL
    : `${config.url}${response.signedURL}`;
}

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}
