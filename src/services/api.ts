import { apiClient } from "@/lib/api-client";
import type {
  ContragentMeta,
  Warehouse,
  PayboxMeta,
  Organization,
  PriceType,
  NomenclatureMeta,
  SalePayload,
  SaleResponse,
} from "@/types";

// ─── Contragents ──────────────────────────────────────────────────────────────

export const fetchContragents = (token: string, phone?: string) => {
  const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
  return apiClient.get<ContragentMeta>(`/contragents/meta${query}`, token);
};

// ─── Warehouses ───────────────────────────────────────────────────────────────

export const fetchWarehouses = (token: string) =>
  apiClient.get<Warehouse[]>("/warehouses", token);

// ─── Payboxes ─────────────────────────────────────────────────────────────────

export const fetchPayboxes = (token: string) =>
  apiClient.get<PayboxMeta>("/payboxes/meta", token);

// ─── Organizations ────────────────────────────────────────────────────────────

export const fetchOrganizations = (token: string) =>
  apiClient.get<Organization[]>("/organizations", token);

// ─── Price Types ──────────────────────────────────────────────────────────────

export const fetchPriceTypes = (token: string) =>
  apiClient.get<PriceType[]>("/price_types", token);

// ─── Nomenclature ─────────────────────────────────────────────────────────────

export const fetchNomenclature = (token: string, search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiClient.get<NomenclatureMeta>(`/nomenclature${query}`, token);
};

// ─── Sales ────────────────────────────────────────────────────────────────────

export const createSale = (token: string, payload: SalePayload) =>
  apiClient.post<SaleResponse>("/docs_sales/", token, payload);
