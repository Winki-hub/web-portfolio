// Datos del portfolio: los usa tanto la API REST (la web) como el servidor MCP.

export const about = {
  name: "Lorenzo García-Arévalo Acosta",
  alias: "Winki",
  role: "Fullstack Developer · MERN",
  availability: "Incorporación inmediata",
  location: "Gran Canaria, España · Remoto",
  bio: "Cuatro años construyendo producto real en una plataforma educativa: del código a las decisiones de arquitectura. Me mueve seguir creciendo, trabajar en equipo y aprender tanto de los aciertos como de los errores.",
  links: {
    email: "Lgaa.developer@gmail.com",
    linkedin: "https://www.linkedin.com/in/lorenzo-garc%C3%ADa-ar%C3%A9valo",
    github: "https://github.com/Winki-hub",
    portfolio: "https://web-portfolio-omega-ten.vercel.app"
  },
  languages: { "Español": "Nativo", "Inglés": "Medio-Alto" },
  skills: ["JavaScript", "React", "Node.js / Express", "HTML / CSS / Tailwind", "MySQL / MariaDB", "Git / GitHub", "Docker", "AWS (básico)"],
  experience: [
    {
      company: "Insendi",
      role: "Fullstack Developer — Junior → Mid-level",
      period: "2022-2026 · Remoto (sede Canarias)",
      product: "Plataforma de e-learning (LMS)",
      stack: ["React", "JavaScript", "Node.js", "MySQL", "Docker", "Git", "Jira"],
      highlights: [
        "Desarrollo end-to-end: frontend en React/JavaScript, backend en Node.js, persistencia en MySQL, con librerías de estilos propias del equipo.",
        "Integración LTI con Canvas LMS: sincronización de sesión y datos según el punto de acceso del cliente. Equipo de ~10 personas, entregado en 6 meses.",
        "Progresión de junior a nivel mid-level reconocido tras 3 años, asumiendo más responsabilidad técnica y de producto."
      ]
    }
  ],
  education: [
    { title: "Técnico Superior en Desarrollo de Aplicaciones Web", place: "CIFP Villa de Agüimes", years: "2019-2021" },
    { title: "Bootcamp Fullstack", place: "SPEGC-EOI", years: "2021-2022" },
    { title: "MERN Full Stack", place: "Udemy", years: "2021" }
  ],
  courses: [
    "Desarrollo de productos audiovisuales interactivos — Cesur (2019)",
    "Introducción a la programación en Unity3D / C# (2022)"
  ]
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
    id: 3,
    title: "Pang-Earth",
    description: "Plataformas 2D inspirado en el arcade Pang: en vez de burbujas, revientas animales mutantes creados por un científico-político villano. Tiene tienda de puntos, estadísticas de personaje y vidas en forma de corazones. Mi primer proyecto en Unity/C#, hecho en unos tres meses durante un bootcamp de videojuegos. Prototipo jugable en el navegador.",
    tags: ["Unity", "C#", "Videojuego"],
    url: "https://winkiripinki.itch.io/pang-earth"
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
