import { useEffect, useMemo, useState } from "react";
import { getStoredDemoContext, saveDemoContext } from "@/data/demo/demoMatchPoolSelector";

export function useDemoUserContext() {
  const [context, setContextState] = useState(() => getStoredDemoContext(typeof window !== "undefined" ? window.location.pathname : ""));

  useEffect(() => {
    saveDemoContext(context);
  }, [context]);

  const setContext = (next) => {
    setContextState((prev) => (typeof next === "function" ? next(prev) : { ...prev, ...next }));
  };

  return useMemo(() => ({ context, setContext }), [context]);
}

