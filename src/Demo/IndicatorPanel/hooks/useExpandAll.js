import { useCallback } from "react";
import { useIndicatorPanelStore } from "../store";

/**
 * Returns a function that can be used to toggle open state for all indicator panels
 */
export default function useExpandAll() {
  const metrics = useMetricConfig();
  const setExpanded = useIndicatorPanelStore((state) => state.setExpanded);
  return useCallback(() => {
    const metricIds = metrics.map((m) => m.id);
    setExpanded(metricIds);
  });
}
