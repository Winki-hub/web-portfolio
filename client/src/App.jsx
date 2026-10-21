import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
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

  return (
    <>
      <header className="hero">
        <p className="kicker">Hola, soy</p>
        <h1>Tu Nombre</h1>
        <p className="lead">Desarrollador web y de videojuegos. Hago cosas con React, Node y Godot.</p>
        <nav>
          <a href="#proyectos">Proyectos</a>
          <a href="#sobre-mi">Sobre mí</a>
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
          <p>Cuéntate aquí: qué haces, qué te interesa, qué estás aprendiendo y cómo contactarte.</p>
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
              <li key={e.id}><strong>{e.name}</strong>: {e.message}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} · Hecho con React + Node</footer>
    </>
  );
}
