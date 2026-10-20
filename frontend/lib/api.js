// Sends a scan request to the backend and returns the result.
// Throws an error with a clear, human-readable message if anything fails.
export async function scan(path, options) {
  let response;

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: "POST",
      ...options,
    });
  } catch {
    throw new Error("Could not reach the Sentinel backend. Is it running?");
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new Error(problem?.detail || "Something went wrong during the scan.");
  }

  return response.json();
}