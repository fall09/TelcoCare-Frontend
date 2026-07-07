const BASE_URL = "http://localhost:8080/api/customer-statuses";

function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getCustomerStatuses() {
  const response = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch customer statuses");
  }

  return response.json();
}

export async function getInactiveReasons() {
  const response = await fetch(`${BASE_URL}/inactive-reasons`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inactive reasons");
  }

  return response.json();
}

export async function getSuspendedReasons() {
  const response = await fetch(`${BASE_URL}/suspended-reasons`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch suspended reasons");
  }

  return response.json();
}