"use client";

import { Loader2, CheckCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem, Contragent } from "@/src/types";

interface OrderSummaryProps {
  cart: CartItem[];
  contragent: Contragent | null;
  submitting: boolean;
  onSubmit: (isPosted: boolean) => void;
}

export function OrderSummary({
  cart,
  contragent,
  submitting,
  onSubmit,
}: OrderSummaryProps) {
  const withoutDiscount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalDiscount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.discount / 100),
    0
  );

  const total = withoutDiscount - totalDiscount;
  const loyaltyBalance = contragent?.bonus_balance ?? 0;
  const points = Math.floor(total * 0.05);

  const rows = [
    { label: "Without discount", value: `₽${withoutDiscount.toFixed(2)}`, muted: true },
    { label: "Discount", value: `-₽${totalDiscount.toFixed(2)}`, accent: totalDiscount > 0 },
    { label: "Loyalty balance", value: loyaltyBalance > 0 ? `₽${loyaltyBalance.toFixed(2)}` : "No counterparty", warn: loyaltyBalance === 0 },
    { label: "Total", value: `₽${total.toFixed(2)}`, bold: true },
    { label: "Points", value: points.toFixed(2), muted: true },
    { label: "In rubles", value: `₽${total.toFixed(2)}`, bold: true },
  ];

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-2.5 ${
              i < rows.length - 1 ? "border-b border-slate-700/30" : ""
            }`}
          >
            <span className="text-slate-400 text-xs">{row.label}</span>
            <span
              className={`text-sm font-medium ${
                row.bold
                  ? "text-white font-semibold"
                  : row.accent
                  ? "text-emerald-400"
                  : row.warn
                  ? "text-amber-400 text-xs"
                  : "text-slate-300"
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => onSubmit(false)}
          disabled={submitting || cart.length === 0}
          variant="outline"
          className="h-12 rounded-xl border-slate-600 bg-slate-800/60 text-white hover:bg-slate-700 hover:text-white font-semibold transition-all disabled:opacity-40"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1.5" />
              Create
            </>
          )}
        </Button>

        <Button
          onClick={() => onSubmit(true)}
          disabled={submitting || cart.length === 0}
          className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all disabled:opacity-40"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCheck className="w-4 h-4 mr-1.5" />
              Create & Post
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
