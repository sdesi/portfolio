console.log("filter.js loaded");

const dropdown = document.querySelector(".filter-dropdown");
const toggle = document.querySelector(".filter-toggle");
const toggleLabel = document.querySelector(".filter-toggle-label");
const options = document.querySelectorAll(".filter-option");
const cards = document.querySelectorAll(".project-card");

if (!dropdown || !toggle || !options.length || !cards.length) {
  console.warn("Фильтр: не нашли какие-то элементы. Проверь разметку.");
}

// 1) Сопоставление фильтров с короткими кодами для URL
const FILTER_TO_CODE = {
  all: "a",
  graphic: "g",
  navigation: "n",
  "3d": "d",
};

const CODE_TO_FILTER = {};
for (const [filter, code] of Object.entries(FILTER_TO_CODE)) {
  CODE_TO_FILTER[code] = filter;
}

// Соберём список валидных фильтров из разметки
const AVAILABLE_FILTERS = new Set(
  Array.from(options).map((opt) => opt.dataset.filter)
);

// 2) Берём фильтр из URL: ?f=...
function getFilterFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const codeOrFilter = params.get("f"); // короткий код

  if (!codeOrFilter) {
    return "all";
  }

  // Сначала пробуем расшифровать как код
  const fromCode = CODE_TO_FILTER[codeOrFilter];
  if (fromCode && AVAILABLE_FILTERS.has(fromCode)) {
    return fromCode;
  }

  // Если кода нет в мапе, но вдруг в URL лежит прямо имя фильтра
  if (AVAILABLE_FILTERS.has(codeOrFilter)) {
    return codeOrFilter;
  }

  return "all";
}

// 3) Применяем фильтр: кнопки, текст, карточки, URL
function applyFilter(filter, { updateUrl = false } = {}) {
  // активный пункт в меню
  options.forEach((opt) => {
    opt.classList.toggle("active", opt.dataset.filter === filter);
  });

  // подпись на основной кнопке
  const activeOption = Array.from(options).find(
    (opt) => opt.dataset.filter === filter
  );
  if (toggleLabel && activeOption) {
    toggleLabel.textContent = activeOption.textContent.trim();
  }

  if (toggle) {
    toggle.dataset.currentFilter = filter;
  }

  // показываем / скрываем карточки
  cards.forEach((card) => {
    const categories = card.dataset.categories
      .split(",")
      .map((c) => c.trim());

    const shouldShow =
      filter === "all" || categories.includes(filter);

    card.style.display = shouldShow ? "" : "none";
  });

  // обновляем URL, если нужно
  if (updateUrl) {
    const url = new URL(window.location.href);

    // Удаляем старый параметр, если он остался
    url.searchParams.delete("filter");

    if (filter === "all") {
      url.searchParams.delete("f");
    } else {
      const code = FILTER_TO_CODE[filter] || filter;
      url.searchParams.set("f", code);
    }

    window.history.replaceState({}, "", url.toString());
  }
}

// 4) Открытие / закрытие меню
if (toggle && dropdown) {
  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdown.classList.toggle("open");
  });
}

// 5) Клик по пункту меню
options.forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    const filter = option.dataset.filter;
    applyFilter(filter, { updateUrl: true });
    dropdown.classList.remove("open");
  });
});

// 6) Клик вне дропдауна — закрываем
document.addEventListener("click", () => {
  if (dropdown) {
    dropdown.classList.remove("open");
  }
});

// 7) Инициализация: читаем фильтр из URL и применяем
const initialFilter = getFilterFromUrl();
applyFilter(initialFilter, { updateUrl: false });
