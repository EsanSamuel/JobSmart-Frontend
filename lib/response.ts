export function responseList<T = unknown>(response: any): T[] {
  const payload = response?.data?.data;
  if (Array.isArray(payload)) return payload;

  for (const key of ["result", "items", "resumes", "data"]) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return [];
}
