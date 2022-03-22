/**
 * Takes a flat array of metrics and returns a nested array of metrics
 * based on category and subcategory attributes.
 * @param {*} metrics
 * @param {*} category
 * @param {*} depth
 * @returns
 */
export const createMetricTree = (metrics, category = "", depth = 0) => {
  if (!metrics || !metrics.length || depth > 2) {
    return null;
  }
  const key = depth < 2 ? "category" : "subcategory";
  const shaped = metrics
    .filter((m) => m[key] === category)
    .map((metric) => {
      const children = createMetricTree(metrics, metric.id, depth + 1);
      return {
        ...metric,
        children,
      };
    });
  return depth === 1 ? shaped.filter((m) => !m.subcategory) : shaped;
};
