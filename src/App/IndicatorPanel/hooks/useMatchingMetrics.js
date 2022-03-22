import { useMetricConfig } from "@hyperobjekt/react-dashboard";
import { createMetricTree } from "../utils";

export default function useMatchingMetrics() {
  const metrics = useMetricConfig();
  return createMetricTree(metrics);
}
