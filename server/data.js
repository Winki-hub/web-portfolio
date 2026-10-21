// Datos del portfolio: los usa tanto la API REST (la web) como el servidor MCP.

export const about = {
  name: "Winki",
  role: "Desarrollador web y de videojuegos",
  bio: "Hago cosas con React, Node y Godot. Edita este texto en server/data.js.",
  links: {
    github: "https://github.com/Winki-hub",
    portfolio: "https://web-portfolio-omega-ten.vercel.app"
  }
};

export const projects = [
  {
    id: 1,
    title: "Winkiripinki, el libro",
    description: "Videojuego hecho en Godot.",
    tags: ["Godot", "GDScript"],
    url: "",
    repo: ""
  },
  {
    id: 2,
    title: "Este portfolio",
    description: "Web full-stack con React + Node/Express, desplegada gratis en Vercel y Render. Incluye un servidor MCP para que las IAs puedan consultarlo.",
    tags: ["React", "Node", "Express", "MCP"],
    url: "https://web-portfolio-omega-ten.vercel.app",
    repo: "https://github.com/Winki-hub/web-portfolio"
  }
];

// Libro de visitas en memoria: se vacía cuando el servidor se reinicia.
const guestbook = [];
const MAX_ENTRIES = 200;

export function listGuestbook(limit = 50) {
  return guestbook.slice(-limit).reverse();
}

export function addGuestbookEntry(rawName, rawMessage, source = "web") {
  const name = String(rawName ?? "").trim().slice(0, 40);
  const message = String(rawMessage ?? "").trim().slice(0, 280);
  if (!name || !message) {
    throw new Error("Nombre y mensaje son obligatorios");
  }
  const entry = { id: Date.now(), name, message, source, date: new Date().toISOString() };
  guestbook.push(entry);
  if (guestbook.length > MAX_ENTRIES) guestbook.shift();
  return entry;
}
