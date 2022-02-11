import { useMemo } from "react";
import { useConfigStore } from "..";

/**
 * Returns app config object or key if provided
 */
export default function useAppConfig(key) {
  const appConfig = useConfigStore((state) => state.app);
  return useMemo(() => (key ? appConfig[key] : appConfig), [key, appConfig]);
}
