const KEY = "sentinel-recent-scans";
const MAX = 10;

// Read saved scans (or an empty list if there are none)
export function getScans() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

// Add a scan to the top of the list, keep only the newest 10
export function saveScan(entry) {
  try {
    const scans = [{ ...entry, time: Date.now() }, ...getScans()].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(scans));
  } catch {
    // If storage is blocked, just skip saving
  }
}

export function clearScans() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}