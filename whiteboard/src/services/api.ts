// all API calls for shapes and pages are handled here

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

/* ------------------ shape related ------------------ */

export async function fetchShapes() {
  try {
    const res = await fetch(`${API_BASE}/shapes`);
    if (!res.ok) throw new Error(`fetchShapes failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("fetchShapes error:", err);
    return [];
  }
}

export async function createShape(shape: any) {
  try {
    const res = await fetch(`${API_BASE}/shapes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shape),
    });
    if (!res.ok) throw new Error(`createShape failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("createShape error:", err);
    return null;
  }
}

export async function updateShape(id: string, payload: any) {
  try {
    const res = await fetch(`${API_BASE}/shapes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`updateShape failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("updateShape error:", err);
    return null;
  }
}

export async function deleteShape(id: string) {
  try {
    const res = await fetch(`${API_BASE}/shapes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`deleteShape failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("deleteShape error:", err);
    return null;
  }
}

/* ------------------ page related ------------------ */

export async function getPages() {
  try {
    const res = await fetch(`${API_BASE}/pages`);
    if (!res.ok) throw new Error(`getPages failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("getPages error:", err);
    return [];
  }
}

export async function createPage(name: string) {
  try {
    const res = await fetch(`${API_BASE}/pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error(`createPage failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("createPage error:", err);
    return null;
  }
}

export async function deletePage(id: string) {
  try {
    const res = await fetch(`${API_BASE}/pages/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`deletePage failed (${res.status})`);
    return true;
  } catch (err) {
    console.error("deletePage error:", err);
    return false;
  }
}

export async function renamePage(id: string, newName: string) {
  try {
    const res = await fetch(`${API_BASE}/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (!res.ok) throw new Error(`renamePage failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("renamePage error:", err);
    return null;
  }
}
