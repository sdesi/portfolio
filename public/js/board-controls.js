console.log("board-controls.js loaded");

const board = document.getElementById("board-inner");

if (!board) {
  console.warn("board-inner not found");
} else {
  // начальное положение камеры и масштаб
  let cameraX = parseFloat(board.dataset.cameraX || "0");
  let cameraY = parseFloat(board.dataset.cameraY || "0");
  let zoom = 1;

  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 3;

  function applyTransform() {
    board.style.transform = "translate(" + cameraX + "px, " + cameraY + "px) scale(" + zoom + ")";
  }

  applyTransform();

  // -------------------------------
  //       МЫШЬ: ЛКМ → ДРАГ
  // -------------------------------
  let isDraggingMouse = false;
  let startX = 0;
  let startY = 0;

  window.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return; // только левая кнопка

    const target = e.target;
    if (target instanceof HTMLElement && target.closest("header")) {
      // по хэдеру — холст не двигаем
      return;
    }

    isDraggingMouse = true;
    startX = e.clientX;
    startY = e.clientY;
    document.body.classList.add("is-dragging-board");
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDraggingMouse) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    cameraX += dx;
    cameraY += dy;

    startX = e.clientX;
    startY = e.clientY;

    e.preventDefault();
    applyTransform();
  });

  window.addEventListener("mouseup", function () {
    if (!isDraggingMouse) return;
    isDraggingMouse = false;
    document.body.classList.remove("is-dragging-board");
  });

  // -------------------------------
  //     ТАЧ: 1 ПАЛЕЦ → ДРАГ
  // -------------------------------

  let isTouchDragging = false;

  window.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const target = t.target;

        if (target instanceof HTMLElement && target.closest("header")) {
          // свайп по хэдеру — не двигаем холст
          isTouchDragging = false;
          return;
        }

        isTouchDragging = true;
        startX = t.clientX;
        startY = t.clientY;
        document.body.classList.add("is-dragging-board");
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches.length === 1 && isTouchDragging) {
        const t = e.touches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        cameraX += dx;
        cameraY += dy;

        startX = t.clientX;
        startY = t.clientY;

        // блокируем скролл страницы во время драга холста
        e.preventDefault();
        applyTransform();
      }
    },
    { passive: false }
  );

  window.addEventListener("touchend", function () {
    if (!isTouchDragging) return;
    isTouchDragging = false;
    document.body.classList.remove("is-dragging-board");
  });

  window.addEventListener("touchcancel", function () {
    if (!isTouchDragging) return;
    isTouchDragging = false;
    document.body.classList.remove("is-dragging-board");
  });

  // -------------------------------
  //   ТАЧ: 2 ПАЛЬЦА → PINCH ZOOM
  // -------------------------------

  let isPinching = false;
  let pinchPrevDistance = 0;

  function getDistance(t1, t2) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  }

  function getCenter(t1, t2) {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }

  window.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];

        const target1 = t1.target;
        const target2 = t2.target;

        if (
          (target1 instanceof HTMLElement && target1.closest("header")) ||
          (target2 instanceof HTMLElement && target2.closest("header"))
        ) {
          // если пальцы в хэдере — не зумим
          return;
        }

        isPinching = true;
        isTouchDragging = false; // отключаем одиночный драг
        pinchPrevDistance = getDistance(t1, t2);
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      if (!isPinching || e.touches.length !== 2) return;

      const t1 = e.touches[0];
      const t2 = e.touches[1];

      const dist = getDistance(t1, t2);
      if (pinchPrevDistance === 0) {
        pinchPrevDistance = dist;
        return;
      }

      const centerScreen = getCenter(t1, t2);

      // мировые координаты точки под центром жеста до изменения зума
      const worldX = (centerScreen.x - cameraX) / zoom;
      const worldY = (centerScreen.y - cameraY) / zoom;

      // новый зум относительно предыдущего шага
      const scaleChange = dist / pinchPrevDistance;
      let newZoom = zoom * scaleChange;
      if (newZoom < MIN_ZOOM) newZoom = MIN_ZOOM;
      if (newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;

      zoom = newZoom;

      // пересчитать камеру так, чтобы world-точка осталась под тем же экранным центром
      cameraX = centerScreen.x - worldX * zoom;
      cameraY = centerScreen.y - worldY * zoom;

      pinchPrevDistance = dist;

      e.preventDefault();
      applyTransform();
    },
    { passive: false }
  );

  window.addEventListener("touchend", function (e) {
    if (e.touches.length < 2) {
      isPinching = false;
      pinchPrevDistance = 0;
    }
    if (e.touches.length === 0) {
      document.body.classList.remove("is-dragging-board");
    }
  });

  window.addEventListener("touchcancel", function (e) {
    isPinching = false;
    pinchPrevDistance = 0;
    if (e.touches.length === 0) {
      document.body.classList.remove("is-dragging-board");
    }
  });
}
