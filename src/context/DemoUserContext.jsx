import { createContext, useContext, useMemo, useState } from "react";
import { getStoredDemoContext, saveDemoContext } from "@/data/demo/demoMatchPoolSelector";

const DemoUserContext = createContext(null);

export function DemoUserProvider({ children }) {
  const [context, setContextState] = useState(() => getStoredDemoContext(window.location.pathname));

  const setContext = (next) => {
    setContextState((prev) => {
      const merged = typeof next === "function" ? next(prev) : { ...prev, ...next };
      saveDemoContext(merged);
      return merged;
    });
  };

  const value = useMemo(() => ({ context, setContext }), [context]);
  return <DemoUserContext.Provider value={value}>{children}</DemoUserContext.Provider>;
}

export function useDemoUserContextValue() {
  const ctx = useContext(DemoUserContext);
  if (ctx) return ctx;
  const fallback = getStoredDemoContext(typeof window !== "undefined" ? window.location.pathname : "");
  return { context: fallback, setContext: () => {} };
}

