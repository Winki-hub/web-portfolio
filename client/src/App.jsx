import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const MCP_URL = `${API}/mcp`;

const MCP_TOOLS = [
  ["get_about", "mi bio y contactos"],
  ["get_projects", "mis proyectos (filtrables por tecnología)"],
  ["get_guestbook", "los últimos mensajes del libro de visitas"],
  ["sign_guestbook", "firmar el libro de visitas"]
];

export default function App() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/about`).then((r) => r.json()).then(setAbout).catch(() => {});
    fetch(`${API}/api/projects`).then((r) => r.json()).then(setProjects).catch(() => {});
    fetch(`${API}/api/guestbook`).then((r) => r.json()).then(setEntries).catch(() => {});
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    setStatus("Enviando…");
    try {
      const res = await fetch(`${API}/api/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const entry = await res.json();
      setEntries([entry, ...entries]);
      setForm({ name: "", message: "" });
      setStatus("¡Gracias por tu mensaje!");
    } catch (err) {
      setStatus(err.message || "No se pudo enviar (¿está el servidor despierto?)");
    }
  }

  async function copyMcpUrl() {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* el navegador no dejó copiar */
    }
  }

  return (
    <>
      <header className="hero">
        <p className="kicker">Hola, soy</p>
        <h1>{about?.name ?? "Winki"}</h1>
        <p className="lead">{about?.bio ?? "Desarrollador web y de videojuegos. Hago cosas con React, Node y Godot."}</p>
        <nav>
          <a href="#proyectos">Proyectos</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#mcp">MCP</a>
          <a href="#libro">Libro de visitas</a>
        </nav>
      </header>

      <main>
        <section id="proyectos">
          <h2>Proyectos</h2>
          {projects.length === 0 && <p className="muted">Cargando proyectos… (la primera carga puede tardar si el servidor estaba dormido)</p>}
          <div className="grid">
            {projects.map((p) => (
              <article key={p.id} className="card">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                <div className="links">
                  {p.url && <a href={p.url} target="_blank" rel="noreferrer">Demo</a>}
                  {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Código</a>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="sobre-mi">
          <h2>Sobre mí</h2>
          <p>{about?.role ?? "Desarrollador web y de videojuegos"}</p>
          {about?.links && (
            <div className="links">
              {Object.entries(about.links).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer">{k}</a>
              ))}
            </div>
          )}
        </section>

        <section id="mcp">
          <h2>Conecta mi portfolio a tu IA 🤖</h2>
          <p>
            Este portfolio es también un <strong>servidor MCP</strong> (Model Context Protocol).
            Añádelo como conector en Claude u otro cliente MCP y pregúntale por mí.
          </p>
          <div className="mcp-url">
            <code>{MCP_URL}</code>
            <button type="button" onClick={copyMcpUrl}>{copied ? "¡Copiado!" : "Copiar"}</button>
          </div>
          <p className="muted">Herramientas disponibles:</p>
          <ul className="tools">
            {MCP_TOOLS.map(([name, desc]) => (
              <li key={name}><code>{name}</code>: {desc}</li>
            ))}
          </ul>
          <p className="muted">Prueba a preguntar: “¿Qué proyectos con Godot tiene Winki?”</p>
        </section>

        <section id="libro">
          <h2>Libro de visitas</h2>
          <form onSubmit={sendMessage}>
            <input placeholder="Tu nombre" maxLength={40} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <textarea placeholder="Deja un mensaje" maxLength={280} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button type="submit">Firmar</button>
            {status && <p className="muted">{status}</p>}
          </form>
          <ul className="entries">
            {entries.map((e) => (
              <li key={e.id}>
                <strong>{e.name}</strong>{e.source === "mcp" && <span title="Firmado por una IA vía MCP"> 🤖</span>}: {e.message}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} · Hecho con React + Node + MCP</footer>
    </>
  );
}
