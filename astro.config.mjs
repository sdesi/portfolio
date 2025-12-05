// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  // Прод-адрес сайта
  site: "https://sdesi.github.io/portfolio",
  // Репозиторий называется "portfolio", поэтому base именно такой:
  base: "/portfolio/",
});
