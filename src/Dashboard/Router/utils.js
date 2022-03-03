/**
 * Returns the query params for the current URL.
 */
export const getCurrentUrlQueryParams = () => {
  if (!window?.location?.search) return new URLSearchParams();
  return Object.fromEntries(new URLSearchParams(window.location.search));
};

/**
 * Sets the query params with the provided values.
 * @param {object} values
 */
export const setUrlQueryParams = (values) => {
  const queryParams = new URLSearchParams(values);
  const paramString = queryParams.toString();
  const newValue = `${window?.location?.pathname}?${paramString}`;
  window?.history?.replaceState({}, "", newValue);
};
