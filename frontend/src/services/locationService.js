const BASE_URL = "http://localhost:8080/api/locations";

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getProvinces() {
  const response = await fetch(`${BASE_URL}/provinces`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch provinces");

  return response.json();
}

export async function getDistrictsByProvince(provinceId) {
  const response = await fetch(`${BASE_URL}/districts?provinceId=${provinceId}`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch districts");

  return response.json();
}