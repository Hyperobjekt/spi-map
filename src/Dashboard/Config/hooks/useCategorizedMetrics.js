import useMetricConfig from "./useMetricConfig";

/**
 * Takes a flat array of metrics and returns a nested array of metrics
 * based on category and subcategory attributes.
 * @param {*} metrics
 * @param {*} category
 * @param {*} depth
 * @returns
 */
const shapeCategories = (metrics, category = "", depth = 0) => {
  if (!metrics || !metrics.length || depth > 2) {
    return null;
  }
  const key = depth < 2 ? "category" : "subcategory";
  const shaped = metrics
    .filter((m) => m[key] === category)
    .map((metric) => {
      const children = shapeCategories(metrics, metric.id, depth + 1);
      return {
        ...metric,
        children,
      };
    });
  return depth === 1 ? shaped.filter((m) => !m.subcategory) : shaped;
};

export default function useCategorizedMetrics() {
  const metrics = useMetricConfig();
  return shapeCategories(metrics);
}
