const BASE_URL = "http://localhost:8080/api/tickets";

// Helper keys for localStorage persistence
const UPDATES_KEY = "telcocare_ticket_updates";
const HISTORY_KEY = "telcocare_ticket_history";

// Helper to get local updates
function getLocalUpdates() {
  const data = localStorage.getItem(UPDATES_KEY);
  return data ? JSON.parse(data) : {};
}

// Helper to save local updates
function saveLocalUpdates(updates) {
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
}

// Helper to get local histories
function getLocalHistories() {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

// Helper to save local histories
function saveLocalHistories(histories) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(histories));
}

export async function getTickets() {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }
  return response.json();
}

export async function getTicketById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch ticket");
  }
  return response.json();
}

export async function createTicket(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create ticket");
  }

  return response.json();
}

export async function updateTicket(id, payload) {
  // payload içeriği: { status, priority, description, note }
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update ticket");
  }
  return response.json();
}

export async function getTicketStatusHistory(id) {
  const response = await fetch(`${BASE_URL}/${id}/status-history`);
  if (!response.ok) {
    throw new Error("Failed to fetch ticket status history");
  }
  return response.json();
}