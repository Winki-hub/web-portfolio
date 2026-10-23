// Datos del CV que la web pinta al instante (sin esperar al servidor).
// Si cambias algo aquí, cámbialo también en server/data.js para que el MCP diga lo mismo.

export const profile = {
  name: "Lorenzo García-Arévalo Acosta",
  role: "Fullstack Developer",
  availability: "Incorporación inmediata",
  photo: "/foto.jpg", // pon tu foto en client/public/foto.jpg
  initials: "LG",
  bio: "Cuatro años construyendo producto real en una plataforma educativa: del código a las decisiones de arquitectura. Me mueve seguir creciendo, trabajar en equipo y aprender tanto de los aciertos como de los errores.",
  contact: [
    { type: "mail", label: "winkiripinki@gmail.com", href: "mailto:winkiripinki@gmail.com" },
    { type: "web", label: "linkedin.com/in/lorenzo-garcía-arévalo", href: "https://www.linkedin.com/in/lorenzo-garc%C3%ADa-ar%C3%A9valo" },
    { type: "code", label: "github.com/Winki-hub", href: "https://github.com/Winki-hub" },
    { type: "pin", label: "Gran Canaria, España · Remoto" }
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Medio-Alto" }
  ],
  skills: [
    { name: "JavaScript", level: 92 },
    { name: "React", level: 85 },
    { name: "Node.js / Express", level: 78 },
    { name: "HTML / CSS / Tailwind", level: 85 },
    { name: "MySQL / MariaDB", level: 75 },
    { name: "Git / GitHub", level: 85 },
    { name: "Docker", level: 50 },
    { name: "AWS (básico)", level: 35 }
  ],
  experience: [
    {
      company: "Insendi",
      rol: "Fullstack Developer — Junior → Mid-level",
      periodo: "2022-2026 · Remoto",
      producto: "Plataforma de aprendizaje online usada por escuelas de negocio como Oxford, Imperial College, Johns Hopkins o HKUST",
      stack: ["React", "JavaScript", "Node.js", "MySQL", "Docker", "CircleCI", "Datadog", "Jira"],
      aportes: [
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

// Se muestran mientras el servidor despierta; luego se sustituyen por los de la API.
export const fallbackProjects = [
  {
    id: 1,
    title: "Winkiripinki, el libro",
    description: "Videojuego hecho en Godot.",
    tags: ["Godot", "GDScript"]
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
