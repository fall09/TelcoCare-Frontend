const BASE_URL = "http://localhost:8080/api/customers";

export async function getCustomers(search = "") {
    const url = search
        ? `${BASE_URL}?search=${encodeURIComponent(search)}`
        : BASE_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch customers.");
    }

    return await response.json();
}