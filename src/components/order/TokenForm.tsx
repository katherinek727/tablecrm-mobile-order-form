"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { fetchWarehouses } from "@/src/services/api";
import { ApiError } from "@/src/lib/api-client";

interface TokenFormProps {
  onSuccess: (token: string) => void;
}

export function TokenForm({ onSuccess }: TokenFormProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      // Validate token by making a lightweight API call
      await fetchWarehouses(trimmed);
      onSuccess(trimmed);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Invalid token. Please check and try again.");
      } else {
        setError("Unable to connect. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm bg-slate-900/80 border-slate-700/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="pb-2 pt-8 px-8 text-center space-y-4">
          {/* Icon badge */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <KeyRound className="w-7 h-7 text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              TableCRM
            </h1>
            <p className="text-sm text-slate-400">
              Enter your access token to continue
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="token"
                className="text-slate-300 text-xs font-medium uppercase tracking-wider"
              >
                Access Token
              </Label>
              <Input
                id="token"
                type="text"
                placeholder="Paste your token here..."
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                className="bg-slate-800/60 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 h-11 rounded-xl transition-all"
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!value.trim() || loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all duration-200 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
