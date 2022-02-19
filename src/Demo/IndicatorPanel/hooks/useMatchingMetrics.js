import useMetricConfig from "../../../Dashboard/Config/hooks/useMetricConfig";
import { createMetricTree } from "../utils";

export default function useMatchingMetrics() {
  const metrics = useMetricConfig();
  return createMetricTree(metrics);
}
