"use client";

import { useState, useEffect, useCallback } from "react";
import { LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type {
  Contragent,
  Warehouse,
  Paybox,
  Organization,
  PriceType,
  CartItem,
} from "@/src/types";
import {
  fetchWarehouses,
  fetchPayboxes,
  fetchOrganizations,
  fetchPriceTypes,
} from "@/src/services/api";

interface OrderFormProps {
  token: string;
  onLogout: () => void;
}

export function OrderForm({ token, onLogout }: OrderFormProps) {
  // ── Reference data ──────────────────────────────────────────────────────────
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [payboxes, setPayboxes] = useState<Paybox[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [contragent, setContragent] = useState<Contragent | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [payboxId, setPayboxId] = useState<number | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [priceTypeId, setPriceTypeId] = useState<number | null>(null);
  const [priority, setPriority] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Load reference data on mount ─────────────────────────────────────────────
  const loadMeta = useCallback(async () => {
    setLoadingMeta(true);
    try {
      const [wh, pb, org, pt] = await Promise.all([
        fetchWarehouses(token),
        fetchPayboxes(token),
        fetchOrganizations(token),
        fetchPriceTypes(token),
      ]);
      setWarehouses(wh);
      setPayboxes(pb.data ?? []);
      setOrganizations(org);
      setPriceTypes(pt);

      // Set defaults to first item
      if (wh.length) setWarehouseId(wh[0].id);
      if (pb.data?.length) setPayboxId(pb.data[0].id);
      if (org.length) setOrganizationId(org[0].id);
    } catch {
      toast.error("Failed to load form data. Check your token.");
    } finally {
      setLoadingMeta(false);
    }
  }, [token]);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  // ── Cart helpers ─────────────────────────────────────────────────────────────
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loadingMeta) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">New Order</span>
          </div>

          <div className="flex items-center gap-3">
            {cartCount > 0 && (
              <div className="flex items-center gap-1.5 bg-violet-500/15 border border-violet-500/30 rounded-full px-3 py-1">
                <ShoppingCart className="w-3 h-3 text-violet-400" />
                <span className="text-violet-300 text-xs font-medium">
                  {cartCount} · ₽{cartTotal.toFixed(2)}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Form body — sections will be added in upcoming steps */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <p className="text-slate-500 text-xs text-center">
          Form sections loading...
        </p>
      </main>
    </div>
  );
}
