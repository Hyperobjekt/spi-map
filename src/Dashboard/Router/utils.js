/**
 * Returns the query params for the current URL.
 */
export const getCurrentQueryParams = () => {
  if (!window?.location?.search) return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

/**
 * Sets the query params with the provided values.
 * @param {object} values
 */
export const setQueryParams = (values) => {
  const queryParams = new URLSearchParams(values);
  const paramString = queryParams.toString();
  const newValue = `${window?.location?.pathname}?${paramString}`;
  window?.history?.replaceState({}, "", newValue);
};
