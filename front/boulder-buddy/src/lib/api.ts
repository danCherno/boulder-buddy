const API_BASE = import.meta.env.VITE_API_BASE as string;

import type { Boulder, Hold } from "./types";

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function processImage(file: File, pick?: Hold): Promise<Boulder> {
  const fd = new FormData();
  fd.append("image", file);
  if (pick) {
    fd.append("pick_x", pick.x.toString());
    fd.append("pick_y", pick.y.toString());
  }

  const res = await fetch(`${API_BASE}/api/boulder/process/`, {
    method: "POST",
    headers: { 'X-CSRFToken': getCsrfToken() },
    body: fd,
    credentials: 'include'
  });

  if (!res.ok) throw new Error(`Process failed (${res.status})`);

  const data = await res.json();
  if (!data?.boulder) throw new Error("Missing 'boulder' in response");
  return data.boulder as Boulder;
}

export async function getBoulder(id: string): Promise<Boulder> {
  const res = await fetch(`${API_BASE}/api/boulder/${id}/`, {
    credentials: 'include'
  });

  if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
  return (await res.json()) as Boulder;
}

export async function summarizeBoulder(id: string): Promise<Boulder> {
  const res = await fetch(`${API_BASE}/api/boulder/${id}/summarize/`, {
    credentials: 'include'
  });

  if (!res.ok) throw new Error(`Summarize failed (${res.status})`);

  const data = await res.json();
  if (!data?.boulder) throw new Error("Missing 'boulder' in response");
  return data.boulder as Boulder;
}

export async function updateBoulderPositions(id: string, positions: [number, number][]): Promise<Boulder> {
  const res = await fetch(`${API_BASE}/api/boulder/${id}/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    body: JSON.stringify({ positions }),
    credentials: 'include',
  });

  if (!res.ok) {
    let data: { error?: string } | undefined;
    try {
      data = await res.json();
    } catch {
      data = { error: res.statusText };
    }
    throw new Error(data?.error ?? "Failed to save holds");
  }
  return (await res.json()) as Boulder;
}
