import mustache from "mustache";

/**
 * Replaces all occurrences of {{placeholders}} in the given string with the
 * corresponding values from the given context object.
 * @param {string} template
 * @param {object} values
 * @returns {string}
 */
export const interpolateString = (template, values) => {
  const matches = template.match(/{{[^}]+}}/g) || [];
  const matchKeys = matches.map((match) => match.replace(/[{}]/g, ""));
  const valueKeys = Object.keys(values);
  const missingKeys = matchKeys.filter((key) => !valueKeys.includes(key));
  if (missingKeys.length > 0)
    console.warn("Missing values for interpolation:", missingKeys);
  return mustache.render(template, values);
};
