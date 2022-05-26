import { useMetricConfig } from '@hyperobjekt/react-dashboard';
import { createMetricTree } from '../utils';

export default function useCategorizedMetrics() {
  const metrics = useMetricConfig();
  return createMetricTree(metrics);
}
