"use client";

import { useToken } from "@/src/hooks/useToken";
import { TokenForm } from "@/src/components/order/TokenForm";
import { OrderForm } from "@/src/components/order/OrderForm";

export default function Page() {
  const { token, setToken, clearToken, isLoaded } = useToken();

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

  return <OrderForm token={token} onLogout={clearToken} />;
}
