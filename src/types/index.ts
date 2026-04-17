// ─── Contragent (Client) ─────────────────────────────────────────────────────

export interface Contragent {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  bonus_balance: number;
  discount: number;
}

export interface ContragentMeta {
  data: Contragent[];
  total: number;
}

// ─── Warehouse ────────────────────────────────────────────────────────────────

export interface Warehouse {
  id: number;
  name: string;
}

// ─── Paybox (Payment Account) ─────────────────────────────────────────────────

export interface Paybox {
  id: number;
  name: string;
}

export interface PayboxMeta {
  data: Paybox[];
  total: number;
}

// ─── Organization ─────────────────────────────────────────────────────────────

export interface Organization {
  id: number;
  name: string;
}

// ─── Price Type ───────────────────────────────────────────────────────────────

export interface PriceType {
  id: number;
  name: string;
}

// ─── Nomenclature (Product) ───────────────────────────────────────────────────

export interface Nomenclature {
  id: number;
  name: string;
  price: number;
  unit: string;
  weight: number;
}

export interface NomenclatureMeta {
  data: Nomenclature[];
  total: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  nomenclature: Nomenclature;
  quantity: number;
  price: number;
  discount: number;
}

// ─── Sale Payload ─────────────────────────────────────────────────────────────

export interface SaleProduct {
  nomenclature_id: number;
  quantity: number;
  price: number;
  discount: number;
}

export interface SalePayload {
  contragent_id: number | null;
  warehouse_id: number | null;
  organization_id: number | null;
  price_type_id: number | null;
  paybox_id: number | null;
  priority: number;
  products: SaleProduct[];
  is_posted: boolean;
}

// ─── Sale Response ────────────────────────────────────────────────────────────

export interface SaleResponse {
  id: number;
  number: string;
  status: string;
}
