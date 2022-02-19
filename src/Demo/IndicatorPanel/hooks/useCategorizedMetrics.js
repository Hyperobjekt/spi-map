import useMetricConfig from "../../../Dashboard/Config/hooks/useMetricConfig";
import { createMetricTree } from "../utils";

export default function useCategorizedMetrics() {
  const metrics = useMetricConfig();
  return createMetricTree(metrics);
}
