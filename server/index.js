import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
// En producción pon aquí la URL de tu web en Vercel (variable CLIENT_URL en Render)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// --- Proyectos del portfolio (edítalos a tu gusto) ---
const projects = [
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
    description: "Web full-stack con React + Node/Express, desplegada gratis en Vercel y Render.",
    tags: ["React", "Node", "Express"],
    url: "",
    repo: ""
  }
];

// --- Libro de visitas (en memoria: se vacía si el servidor se reinicia) ---
const guestbook = [];

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/projects", (req, res) => res.json(projects));

app.get("/api/guestbook", (req, res) => res.json(guestbook.slice(-50).reverse()));

app.post("/api/guestbook", (req, res) => {
  const name = String(req.body?.name ?? "").trim().slice(0, 40);
  const message = String(req.body?.message ?? "").trim().slice(0, 280);
  if (!name || !message) {
    return res.status(400).json({ error: "Nombre y mensaje son obligatorios" });
  }
  const entry = { id: Date.now(), name, message, date: new Date().toISOString() };
  guestbook.push(entry);
  res.status(201).json(entry);
});

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
