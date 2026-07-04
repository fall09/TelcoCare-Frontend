const BASE_URL = "http://localhost:8080/api/customers";

export async function getCustomers(search = "") {
  const url = search
    ? `${BASE_URL}?search=${search}`
    : BASE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}

export async function createCustomer(customer) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function updateCustomerStatus(customerId, payload) {
  const response = await fetch(`http://localhost:8080/api/customers/${customerId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update customer status");
  }

  return response.json();
}

export async function getCustomerStatusHistory(customerId) {
  const response = await fetch(
    `http://localhost:8080/api/customers/${customerId}/status-history`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch status history");
  }

  return response.json();
}