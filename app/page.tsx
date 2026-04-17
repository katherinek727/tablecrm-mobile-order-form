"use client";

import { useToken } from "@/src/hooks/useToken";
import { TokenForm } from "@/src/components/order/TokenForm";

export default function Page() {
  const { token, setToken, isLoaded } = useToken();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <TokenForm onSuccess={setToken} />;
  }

  // Order form will be rendered here in the next steps
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading order form...</p>
    </div>
  );
}
