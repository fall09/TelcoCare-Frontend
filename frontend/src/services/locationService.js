const BASE_URL = "http://localhost:8080/api/locations";

export async function getProvinces() {
  const response = await fetch(`${BASE_URL}/provinces`);
  if (!response.ok) throw new Error("Failed to fetch provinces");
  return response.json();
}

export async function getDistrictsByProvince(provinceId) {
  const response = await fetch(`${BASE_URL}/districts?provinceId=${provinceId}`);
  if (!response.ok) throw new Error("Failed to fetch districts");
  return response.json();
}