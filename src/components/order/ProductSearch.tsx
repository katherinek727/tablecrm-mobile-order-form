"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Plus, Package, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchNomenclature } from "@/src/services/api";
import type { Nomenclature, CartItem } from "@/src/types";

interface ProductSearchProps {
  token: string;
  cart: CartItem[];
  onAdd: (item: Nomenclature) => void;
}

export function ProductSearch({ token, cart, onAdd }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Nomenclature[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load all products on first focus
  const handleFocus = () => {
    if (results.length === 0 && !query) {
      loadProducts("");
    } else {
      setOpen(true);
    }
  };

  const loadProducts = (search: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchNomenclature(token, search);
        setResults(res.data ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    loadProducts(e.target.value);
  };

  const handleAdd = (item: Nomenclature) => {
    onAdd(item);
    setQuery("");
    setOpen(false);
  };

  const inCart = (id: number) => cart.some((c) => c.nomenclature.id === id);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleInput}
          onFocus={handleFocus}
          className="pl-10 bg-slate-800/60 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 h-11 rounded-xl"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          {results.map((item) => {
            const added = inCart(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleAdd(item)}
                disabled={added}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left border-b border-slate-800 last:border-0 disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-700/80 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-slate-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-slate-400 text-xs">
                    ₽{item.price.toFixed(2)} · {item.unit}
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  added
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-violet-500/20 text-violet-400 hover:bg-violet-500/40"
                }`}>
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && !loading && results.length === 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl px-4 py-3">
          <p className="text-slate-400 text-sm text-center">No products found</p>
        </div>
      )}
    </div>
  );
}
