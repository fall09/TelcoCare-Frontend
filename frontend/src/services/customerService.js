const BASE_URL = "http://localhost:8080/api/customers";

function authHeaders(json = false) {
  const token = localStorage.getItem("token");

  return {
    ...(json && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
}

export async function getCustomers(
  page = 0,
  size = 15,
  search = "",
  status = "ALL",
  provinceId = "",
  districtId = "",
  hasTicket = "ALL"
) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", size);

  if (search && search.trim() !== "") params.append("search", search.trim());
  if (status && status !== "ALL") params.append("status", status);
  if (provinceId) params.append("provinceId", provinceId);
  if (districtId) params.append("districtId", districtId);
  if (hasTicket !== "ALL") params.append("hasTicket", hasTicket);

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch customers");

  return response.json();
}

export async function createCustomer(customer) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create customer");
  }

  return response.json();
}

export async function updateCustomerStatus(customerId, payload) {
  const response = await fetch(`${BASE_URL}/${customerId}/status`, {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update customer status");
  }

  return response.json();
}

export async function getCustomerStatusHistory(customerId) {
  const response = await fetch(`${BASE_URL}/${customerId}/status-history`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch status history");
  }

  return response.json();
}

export async function getCustomerById(customerId) {
  const response = await fetch(`${BASE_URL}/${customerId}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch customer");
  }

  return response.json();
}

export async function updateCustomer(customerId, customer) {
  const response = await fetch(`${BASE_URL}/${customerId}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update customer");
  }

  return response.json();
}

export async function getCustomerTickets(customerId) {
  const response = await fetch(`${BASE_URL}/${customerId}/tickets`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch customer tickets");
  }

  return response.json();
}
export async function getCustomerStatusCounts() {
  const response = await fetch(`${BASE_URL}/status-counts`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch customer status counts");
  }

  return response.json();
}