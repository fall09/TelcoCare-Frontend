const BASE_URL = "http://localhost:8080/api/customer-statuses";

export async function getCustomerStatuses() {
  const response = await fetch(BASE_URL);
  return response.json();
}

export async function getInactiveReasons() {
  const response = await fetch(`${BASE_URL}/inactive-reasons`);
  return response.json();
}

export async function getSuspendedReasons() {
  const response = await fetch(`${BASE_URL}/suspended-reasons`);
  return response.json();
}