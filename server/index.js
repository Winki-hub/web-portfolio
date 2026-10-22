import express from "express";
import cors from "cors";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { about, projects, listGuestbook, addGuestbookEntry } from "./data.js";
import { createMcpServer } from "./mcp.js";

const app = express();
const PORT = process.env.PORT || 3001;
// URL de la web en Vercel (variable CLIENT_URL en Render)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());

// ---------- API REST para la web (solo tu web puede llamarla) ----------
const api = express.Router();
api.use(cors({ origin: CLIENT_URL }));

api.get("/health", (req, res) => res.json({ ok: true }));
api.get("/about", (req, res) => res.json(about));
api.get("/projects", (req, res) => res.json(projects));
api.get("/guestbook", (req, res) => res.json(listGuestbook()));
api.post("/guestbook", (req, res) => {
  try {
    const entry = addGuestbookEntry(req.body?.name, req.body?.message, "web");
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.use("/api", api);

// ---------- Servidor MCP (público: cualquier cliente MCP puede conectarse) ----------
// Modo "stateless": cada petición crea su propio servidor y transporte.
app.use("/mcp", cors({ origin: "*", exposedHeaders: ["Mcp-Session-Id"] }));

app.post("/mcp", async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("Error MCP:", err);
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Error interno" }, id: null });
    }
  }
});

// En modo stateless no hay streams GET ni sesiones que borrar.
const methodNotAllowed = (req, res) =>
  res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Método no permitido" }, id: null });
// Si alguien abre /mcp en un navegador, le enseñamos una página explicativa.
// Los clientes MCP (que no piden text/html) siguen recibiendo el 405 estándar.
const MCP_INFO_HTML = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MCP · Portfolio de Winki</title>
<style>body{font-family:system-ui,sans-serif;background:#0f1115;color:#e8e6e3;max-width:640px;margin:0 auto;padding:48px 16px;line-height:1.6}
code{background:#171a21;border:1px solid #262b35;border-radius:6px;padding:2px 6px;color:#ffb347}a{color:#ffb347}</style></head>
<body><h1>🤖 Servidor MCP del portfolio de Winki</h1>
<p>Esta dirección no se abre en el navegador: es un <strong>servidor MCP</strong> (Model Context Protocol) para conectar este portfolio a una IA como Claude.</p>
<p>Añádelo como conector personalizado con esta URL:</p>
<p><code>https://winki-portfolio-api.onrender.com/mcp</code></p>
<p>Herramientas: <code>get_about</code>, <code>get_projects</code>, <code>get_guestbook</code>, <code>sign_guestbook</code>.</p>
<p><a href="https://web-portfolio-omega-ten.vercel.app">← Volver al portfolio</a></p>
</body></html>`;

app.get("/mcp", (req, res, next) => {
  if (req.accepts(["text/event-stream", "html"]) === "html") {
    return res.type("html").send(MCP_INFO_HTML);
  }
  methodNotAllowed(req, res, next);
});
app.delete("/mcp", methodNotAllowed);

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`MCP disponible en http://localhost:${PORT}/mcp`);
});
