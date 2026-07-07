export function authHeaders(json = false) {
  const token = localStorage.getItem("token");

  return {
    ...(json && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
}