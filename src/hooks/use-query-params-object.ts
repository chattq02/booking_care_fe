import { useLocation } from "react-router-dom";

export function useQueryParamsObject() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}
