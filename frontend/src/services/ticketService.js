const BASE_URL = "http://localhost:8080/api/tickets";

function authHeaders(json = false) {
  const token = localStorage.getItem("token");

  return {
    ...(json && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
}

export async function getTickets() {
  const response = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return response.json();
}

export async function getTicketById(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ticket");
  }

  return response.json();
}

export async function getTicketStatusHistory(id) {
  const response = await fetch(`${BASE_URL}/${id}/status-history`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ticket status history");
  }

  return response.json();
}

export async function createTicket(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create ticket");
  }

  return response.json();
}

export async function updateTicket(id, payload) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update ticket");
  }

  return response.json();
}

export async function takeTicket(id) {
  const response = await fetch(`${BASE_URL}/${id}/take`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to take ticket");
  }

  return response.json();
}