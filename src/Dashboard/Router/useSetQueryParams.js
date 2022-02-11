import { useEffect } from "react";

export default function useSetQueryParams(values) {
  const queryParams = new URLSearchParams(values);
  const paramString = queryParams.toString();
  useEffect(() => {
    const newValue = `${window?.location?.pathname}?${paramString}`;
    window?.history?.replaceState({}, "", newValue);
  }, [paramString]);
}
