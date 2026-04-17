"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, User, Phone, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchContragents } from "@/src/services/api";
import type { Contragent } from "@/src/types";

interface ClientSearchProps {
  token: string;
  value: Contragent | null;
  onChange: (contragent: Contragent | null) => void;
}

export function ClientSearch({ token, value, onChange }: ClientSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Contragent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = (phone: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!phone.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchContragents(token, phone);
        setResults(res.data ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    search(e.target.value);
  };

  const handleSelect = (c: Contragent) => {
    onChange(c);
    setQuery("");
    setOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Selected client badge */}
      {value ? (
        <div className="flex items-center justify-between bg-slate-800/60 border border-violet-500/40 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-violet-300" />
            </div>
            <div>
              <p className="text-white text-sm font-medium leading-tight">{value.name}</p>
              {value.phone && (
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {value.phone}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClear}
            className="w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 text-slate-300" />
          </button>
        </div>
      ) : (
        /* Search input */
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <Input
            type="tel"
            placeholder="Search by phone number..."
            value={query}
            onChange={handleInput}
            onFocus={() => results.length > 0 && setOpen(true)}
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
      )}

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left border-b border-slate-800 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{c.name}</p>
                {c.phone && (
                  <p className="text-slate-400 text-xs">{c.phone}</p>
                )}
              </div>
              {c.discount > 0 && (
                <span className="ml-auto text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  -{c.discount}%
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.trim() && (
        <div className="absolute z-50 top-full mt-2 w-full bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl px-4 py-3">
          <p className="text-slate-400 text-sm text-center">No clients found</p>
        </div>
      )}
    </div>
  );
}
