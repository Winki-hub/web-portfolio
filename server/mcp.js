import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { about, projects, listGuestbook, addGuestbookEntry } from "./data.js";

const asText = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
});

// Crea un servidor MCP nuevo con las herramientas del portfolio.
export function createMcpServer() {
  const server = new McpServer({ name: "winki-portfolio", version: "1.0.0" });

  server.registerTool(
    "get_about",
    {
      title: "Sobre Winki",
      description: "Devuelve la bio de Winki, su rol y sus enlaces de contacto.",
      annotations: { readOnlyHint: true }
    },
    async () => asText(about)
  );

  server.registerTool(
    "get_projects",
    {
      title: "Proyectos",
      description: "Lista los proyectos del portfolio de Winki. Opcionalmente filtra por tecnología (p. ej. 'Godot', 'React').",
      inputSchema: {
        tag: z.string().optional().describe("Tecnología por la que filtrar, sin distinguir mayúsculas")
      },
      annotations: { readOnlyHint: true }
    },
    async ({ tag }) => {
      const result = tag
        ? projects.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
        : projects;
      return asText(result);
    }
  );

  server.registerTool(
    "get_guestbook",
    {
      title: "Libro de visitas",
      description: "Devuelve los últimos mensajes del libro de visitas del portfolio.",
      inputSchema: {
        limit: z.number().int().min(1).max(50).optional().describe("Cuántos mensajes devolver (por defecto 10)")
      },
      annotations: { readOnlyHint: true }
    },
    async ({ limit }) => asText(listGuestbook(limit ?? 10))
  );

  server.registerTool(
    "sign_guestbook",
    {
      title: "Firmar el libro de visitas",
      description: "Deja un mensaje público en el libro de visitas del portfolio de Winki. Pide confirmación al usuario antes de firmar.",
      inputSchema: {
        name: z.string().min(1).max(40).describe("Nombre que aparecerá en el mensaje"),
        message: z.string().min(1).max(280).describe("Texto del mensaje")
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true }
    },
    async ({ name, message }) => {
      const entry = addGuestbookEntry(name, message, "mcp");
      return { content: [{ type: "text", text: `¡Firmado! Mensaje #${entry.id} de ${entry.name}.` }] };
    }
  );

  return server;
}
