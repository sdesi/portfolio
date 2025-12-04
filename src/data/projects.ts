// src/data/projects.ts

export type Project = {
  slug: string;        // для ссылки: /projects/slug
  title: string;       // название проекта
  short: string;       // короткое описание для главной
  categories: string[]; // ["web", "navigation", ...]
  cover: string;       // путь к обложке, например "/img/coolapp.jpg"
};

export const projects: Project[] = [
  {
    slug: "detali",
    title: "ЖК Детали",
    short: "Навигация для ЖК бизнес-класса",
    categories: ["navigation", "3d"],
    cover: "/img/detali/60-optimized.webp"
  },
  {
    slug: "detali",
    title: "ЖК Детали",
    short: "Навигация для ЖК бизнес-класса",
    categories: ["navigation"],
    cover: "/img/detali/60-optimized.webp"
  }
];
