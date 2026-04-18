"use client";

import { Minus, Plus, Trash2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/src/types";

interface CartTableProps {
  items: CartItem[];
  onQuantityChange: (id: number, quantity: number) => void;
  onDiscountChange: (id: number, discount: number) => void;
  onRemove: (id: number) => void;
}

export function CartTable({
  items,
  onQuantityChange,
  onDiscountChange,
  onRemove,
}: CartTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
          <Package className="w-6 h-6 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm">No products added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const total = item.price * item.quantity * (1 - item.discount / 100);
        return (
          <div
            key={item.nomenclature.id}
            className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 space-y-3"
          >
            {/* Product name + remove */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-white text-sm font-medium leading-tight truncate">
                  {item.nomenclature.name}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  ₽{item.price.toFixed(2)} / {item.nomenclature.unit}
                  {item.nomenclature.weight > 0 && (
                    <span className="ml-2 text-slate-500">
                      {item.nomenclature.weight}g
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.nomenclature.id)}
                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-2">
              {/* Quantity stepper */}
              <div className="flex items-center gap-1 bg-slate-900/60 rounded-lg p-1">
                <button
                  onClick={() =>
                    onQuantityChange(
                      item.nomenclature.id,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3 h-3 text-slate-300" />
                </button>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onQuantityChange(
                      item.nomenclature.id,
                      Math.max(1, Number(e.target.value))
                    )
                  }
                  className="w-12 h-7 text-center text-white text-sm bg-transparent border-0 focus-visible:ring-0 p-0"
                />
                <button
                  onClick={() =>
                    onQuantityChange(item.nomenclature.id, item.quantity + 1)
                  }
                  className="w-7 h-7 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3 h-3 text-slate-300" />
                </button>
              </div>

              {/* Discount */}
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-slate-400 text-xs whitespace-nowrap">Disc %</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={item.discount}
                  onChange={(e) =>
                    onDiscountChange(
                      item.nomenclature.id,
                      Math.min(100, Math.max(0, Number(e.target.value)))
                    )
                  }
                  className="h-8 text-white text-sm bg-slate-900/60 border-slate-600/50 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg"
                />
              </div>

              {/* Line total */}
              <div className="text-right flex-shrink-0">
                <p className="text-white text-sm font-semibold">
                  ₽{total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
