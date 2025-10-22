export async function getGames() {
  try {
    const baseUrl = import.meta.env.VITE_SOCKET_URL;
    const res = await fetch(`${baseUrl}/api/games`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return { status: true, data };
  } catch (e) {
    console.error("Error fetching games:", e);
    return { status: false, data: [] };
  }
}
