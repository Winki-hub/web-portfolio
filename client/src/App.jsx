import { useEffect, useState } from "react";
import { profile, fallbackProjects } from "./profile.js";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
const MCP_URL = `${API}/mcp`;

/* ---------- Iconos (trazo simple, heredan el color del texto) ---------- */
const PATHS = {
  briefcase: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  cap: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
  award: "M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8.5 14l-1.5 7 5-3 5 3-1.5-7",
  folder: "M3 6h6l2 2h10v11H3z",
  robot: "M5 9h14v10H5zM12 5v4M9 13h.01M15 13h.01M9 16h6",
  book: "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h11",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  web: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4",
  pin: "M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
};
function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}

function SectionTitle({ icon, id, children }) {
  return (
    <h2 className="section-title" id={id}>
      <Icon name={icon} />
      {children}
    </h2>
  );
}

/* ---------- Pinta un objeto como código JavaScript ---------- */
const Str = ({ children }) => <span className="t-str">"{children}"</span>;

function CodeValue({ value }) {
  if (Array.isArray(value)) {
    const short = value.every((v) => typeof v === "string" && v.length < 16);
    if (short) {
      return <span className="t-plain">[{value.join(", ")}]</span>;
    }
    return (
      <>
        [
        {value.map((v, i) => (
          <span key={i} className="code-line" style={{ "--indent": 1 }}>
            <Str>{v}</Str>{i < value.length - 1 ? "," : ""}
          </span>
        ))}
        <span className="code-line" style={{ "--indent": 0 }}>]</span>
      </>
    );
  }
  return <Str>{value}</Str>;
}

function CodeObject({ name, data }) {
  const entries = Object.entries(data);
  return (
    <pre className="code-block">
      <code>
        <span className="code-line"><span className="t-kw">const</span> <span className="t-name">{name}</span> = {"{"}</span>
        {entries.map(([key, value], i) => (
          <span key={key} className="code-line" style={{ "--indent": 1 }}>
            <span className="t-key">{key}</span>: <CodeValue value={value} />{i < entries.length - 1 ? "," : ""}
          </span>
        ))}
        <span className="code-line">{"};"}</span>
      </code>
    </pre>
  );
}

/* ---------- Barra lateral ---------- */
function Sidebar() {
  const [photoOk, setPhotoOk] = useState(true);
  return (
    <aside className="sidebar">
      <div className="avatar">
        <span className="brace" aria-hidden="true">{"{"}</span>
        <div className="avatar-ring">
          {photoOk ? (
            <img src={profile.photo} alt={`Foto de ${profile.name}`} onError={() => setPhotoOk(false)} />
          ) : (
            <span className="avatar-initials">{profile.initials}</span>
          )}
        </div>
        <span className="brace" aria-hidden="true">{"}"}</span>
      </div>

      <h1 className="name">{profile.name}</h1>
      <p className="role">{profile.role}</p>
      <p className="availability"><span className="dot" aria-hidden="true" />{profile.availability}</p>
      <p className="bio">{profile.bio}</p>

      <h2 className="side-title">Contacto</h2>
      <ul className="contact">
        {profile.contact.map((c) => (
          <li key={c.label}>
            <Icon name={c.type} />
            {c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.label}</a> : <span>{c.label}</span>}
          </li>
        ))}
      </ul>

      <h2 className="side-title">Idiomas</h2>
      <dl className="languages">
        {profile.languages.map((l) => (
          <div key={l.name}><dt>{l.name}</dt><dd>{l.level}</dd></div>
        ))}
      </dl>

      <h2 className="side-title">Stack &amp; herramientas</h2>
      <ul className="skills">
        {profile.skills.map((s) => (
          <li key={s.name}>
            <span>{s.name}</span>
            <span className="bar" role="meter" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={s.name}>
              <span style={{ width: `${s.level}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------- Página ---------- */
export default function App() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/projects`).then((r) => r.json()).then(setProjects).catch(() => {});
    fetch(`${API}/api/guestbook`).then((r) => r.json()).then(setEntries).catch(() => {});
  }, []);

  async function signGuestbook(e) {
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
      setStatus("Mensaje publicado.");
    } catch (err) {
      setStatus(err.message || "No se pudo enviar. El servidor puede estar despertando: vuelve a intentarlo en unos segundos.");
    }
  }

  async function copyMcpUrl() {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* el navegador no permitió copiar */
    }
  }

  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <p className="updated">// actualizado {new Date().getFullYear()}</p>

        <section>
          <SectionTitle icon="briefcase" id="experiencia">Experiencia</SectionTitle>
          {profile.experience.map(({ company, ...job }) => (
            <CodeObject key={company} name={company} data={job} />
          ))}
        </section>

        <section>
          <SectionTitle icon="folder" id="proyectos">Proyectos</SectionTitle>
          <ul className="projects">
            {projects.map((p) => (
              <li key={p.id} className="project">
                <div className="project-head">
                  <h3>{p.title}</h3>
                  <span className="project-links">
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer">Demo</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Código</a>}
                  </span>
                </div>
                <p>{p.description}</p>
                <p className="tags">{p.tags.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle icon="robot" id="mcp">Pregúntale a tu IA por mí</SectionTitle>
          <p className="lead">
            Este portfolio también es un servidor MCP. Añádelo como conector en Claude
            (u otro cliente MCP) y tu IA podrá consultar mi experiencia, mis proyectos y firmar el libro de visitas.
          </p>
          <div className="code-block mcp">
            <code>
              <span className="code-line"><span className="t-kw">const</span> <span className="t-name">mcp</span> = {"{"}</span>
              <span className="code-line" style={{ "--indent": 1 }}><span className="t-key">url</span>: <Str>{MCP_URL}</Str>,</span>
              <span className="code-line" style={{ "--indent": 1 }}><span className="t-key">tools</span>: [get_about, get_projects, get_guestbook, sign_guestbook]</span>
              <span className="code-line">{"};"}</span>
            </code>
            <button type="button" className="copy" onClick={copyMcpUrl}>{copied ? "URL copiada" : "Copiar URL"}</button>
          </div>
        </section>

        <section>
          <SectionTitle icon="cap" id="formacion">Formación</SectionTitle>
          <ul className="timeline">
            {profile.education.map((e) => (
              <li key={e.title}>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.place}</p>
                </div>
                <span className="years">{e.years}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle icon="award" id="cursos">Otros cursos</SectionTitle>
          <p>{profile.courses.join(" · ")}</p>
        </section>

        <section>
          <SectionTitle icon="book" id="libro">Libro de visitas</SectionTitle>
          <form className="guestbook" onSubmit={signGuestbook}>
            <label>
              Nombre
              <input maxLength={40} required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Mensaje
              <textarea maxLength={280} required value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
            <button type="submit">Firmar el libro</button>
            {status && <p className="status" role="status">{status}</p>}
          </form>
          {entries.length === 0 ? (
            <p className="muted">Aún no hay mensajes. Sé el primero en firmar.</p>
          ) : (
            <ul className="entries">
              {entries.map((e) => (
                <li key={e.id}>
                  <strong>{e.name}</strong>
                  {e.source === "mcp" && <span className="badge" title="Firmado por una IA vía MCP">vía IA</span>}
                  <p>{e.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer>Hecho con React, Node y MCP · desplegado en Vercel y Render</footer>
      </main>
    </div>
  );
}
