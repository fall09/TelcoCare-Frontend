const BASE_URL = "http://localhost:8080/api/reports";

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function fetchReport(endpoint, errorMessage) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getTicketSummary() {
  return fetchReport("/ticket-summary", "Failed to fetch ticket summary");
}

export async function getTopCategory() {
  return fetchReport("/top-category", "Failed to fetch top category");
}

export async function getTopProvince() {
  return fetchReport("/top-province", "Failed to fetch top province");
}

export async function getTopPriority() {
  return fetchReport("/top-priority", "Failed to fetch top priority");
}

export async function getCategoryDistribution() {
  return fetchReport(
    "/category-distribution",
    "Failed to fetch category distribution",
  );
}

export async function getProvinceDistribution() {
  return fetchReport(
    "/province-distribution",
    "Failed to fetch province distribution",
  );
}

export async function getPriorityDistribution() {
  return fetchReport(
    "/priority-distribution",
    "Failed to fetch priority distribution",
  );
}

export async function getSubCategoryDistribution() {
  return fetchReport(
    "/sub-category-distribution",
    "Failed to fetch sub category distribution",
  );
}

export async function getDailyTrend() {
  return fetchReport(
    "/daily-trend",
    "Failed to fetch daily trend",
  );
}