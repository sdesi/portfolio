// src/data/projects.ts

export type Project = {
  slug: string;         // для ссылки: /projects/slug
  title: string;        // название проекта
  short: string;        // описание для главной
  categories: string[]; // ["graphic", "navigation", "3d", ...]
  cover: string;        // относительный путь к обложке БЕЗ ведущего "/"
};

export const projects: Project[] = [
  {
    slug: "detali",
    title: "ЖК Детали",
    short: "Навигация для ЖК бизнес-класса",
    categories: ["navigation"],
    cover: "img/detali/60-optimized.webp",
  },
];
