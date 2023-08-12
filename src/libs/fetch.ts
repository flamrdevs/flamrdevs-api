const get = async <T>(url: string) => {
  const response = await fetch(url, { method: "GET" });
  if (response.ok) return (await response.json()) as T;
  throw new Error("Failed to fetch");
};

export { get };
