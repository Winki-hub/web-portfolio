// Datos del portfolio: los usa tanto la API REST (la web) como el servidor MCP.

export const about = {
  name: "Lorenzo García-Arévalo Acosta",
  alias: "Winki",
  role: "Fullstack Developer",
  availability: "Incorporación inmediata",
  location: "Gran Canaria, España · Remoto",
  bio: "Cuatro años construyendo producto real en una plataforma educativa: del código a las decisiones de arquitectura. Me mueve seguir creciendo, trabajar en equipo y aprender tanto de los aciertos como de los errores.",
  links: {
    email: "winkiripinki@gmail.com",
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
      period: "2022-2026 · Remoto",
      product: "Plataforma de aprendizaje online usada por escuelas de negocio como Oxford, Imperial College, Johns Hopkins o HKUST",
      stack: ["React", "JavaScript", "Node.js", "MySQL", "Docker", "CircleCI", "Datadog", "Jira"],
      highlights: [
        "Desarrollo fullstack de funcionalidades para profesores y alumnos: cursos, programas, actividades, roles, calificaciones y notificaciones.",
        "Integración LTI con Canvas: nuevo servicio conectado al resto de la plataforma. Propuse mantener la experiencia, incluido el panel de administración, dentro de Canvas en lugar de redirigir.",
        "Rediseño de endpoints antiguos de la API, refactorización y tests unitarios y de integración.",
        "Referente del equipo detectando bugs y fallos de seguridad probando casos límite.",
        "Trabajo con la librería de componentes y estilos del equipo, i18n, despliegues con CircleCI y monitorización con Datadog.",
        "Equipo Agile de ~10 personas: sprints, code reviews y debate activo sobre prácticas de testing y calidad."
      ]
    }
  ],
  caseStudy: {
    title: "Caso de estudio: integración LTI con Canvas",
    context: "Las universidades querían usar las actividades y contenidos de nuestra plataforma sin salir de su propio LMS. La solución fue integrarnos mediante LTI, empezando por Canvas y con la idea de extenderlo después a otros LMS.",
    built: "Creamos un servicio LTI nuevo a partir de un fork de una librería LTI de código abierto, que adaptamos a fondo, y lo conectamos con el resto de servicios de la plataforma. El proyecto se entregó en 6 meses con un equipo de ~10 personas.",
    challenges: [
      "Alta automática de usuarios: Canvas envía los datos del usuario al lanzar la herramienta; con ellos se crea o vincula su cuenta en nuestra plataforma, que lo reconoce en los siguientes accesos.",
      "Mantener el rol correcto (alumno, profesor, administrador) entre Canvas y nuestra plataforma.",
      "Sesión, cookies y caché funcionando dentro de Canvas, y las llamadas a la API que dependían de ellas."
    ],
    decisions: [
      "Mantener la experiencia completa dentro de Canvas: si el usuario entra desde Canvas, no tiene por qué acabar en otra web.",
      "Un panel de administración dentro de la propia integración, para que los administradores no tuvieran que entrar en nuestra plataforma."
    ]
  },
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
