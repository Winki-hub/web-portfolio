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
app.get("/mcp", methodNotAllowed);
app.delete("/mcp", methodNotAllowed);

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
  console.log(`MCP disponible en http://localhost:${PORT}/mcp`);
});
