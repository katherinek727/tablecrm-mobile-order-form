"use client";

import { useState, useEffect } from "react";

const TOKEN_KEY = "tablecrm_token";

export function useToken() {
  const [token, setTokenState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setTokenState(stored);
    setIsLoaded(true);
  }, []);

  const setToken = (value: string) => {
    localStorage.setItem(TOKEN_KEY, value);
    setTokenState(value);
  };

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState("");
  };

  return { token, setToken, clearToken, isLoaded };
}
