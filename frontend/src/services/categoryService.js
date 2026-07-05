const BASE_URL = "http://localhost:8080/api/categories";

export async function getCategories() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function getSubCategories(categoryId) {
  const response = await fetch(`${BASE_URL}/${categoryId}/sub-categories`);
  if (!response.ok) throw new Error("Failed to fetch sub categories");
  return response.json();
}
export async function createCategory(payload) {
  const response = await fetch("http://localhost:8080/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create category");
  }

  return response.json();
}

export async function createSubCategory(categoryId, payload) {
  const response = await fetch(
    `http://localhost:8080/api/categories/${categoryId}/sub-categories`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create sub category");
  }

  return response.json();
}

export async function updateSubCategory(subCategoryId, payload) {
  const response = await fetch(
    `http://localhost:8080/api/categories/sub-categories/${subCategoryId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update sub category");
  }

  return response.json();
}