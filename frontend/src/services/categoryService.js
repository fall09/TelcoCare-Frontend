const BASE_URL = "http://localhost:8080/api/categories";

function authHeaders(json = false) {
  const token = localStorage.getItem("token");

  return {
    ...(json && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
}

export async function getCategories() {
  const response = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch categories");

  return response.json();
}

export async function getSubCategories(categoryId) {
  const response = await fetch(`${BASE_URL}/${categoryId}/sub-categories`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch sub categories");

  return response.json();
}

export async function createCategory(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create category");

  return response.json();
}

export async function createSubCategory(categoryId, payload) {
  const response = await fetch(`${BASE_URL}/${categoryId}/sub-categories`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create sub category");

  return response.json();
}

export async function updateSubCategory(subCategoryId, payload) {
  const response = await fetch(
    `${BASE_URL}/sub-categories/${subCategoryId}`,
    {
      method: "PUT",
      headers: authHeaders(true),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw new Error("Failed to update sub category");

  return response.json();
}