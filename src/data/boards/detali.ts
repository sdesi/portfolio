import type { BoardBlock, BoardView } from "../../types/Board";

export const blocks: BoardBlock[] = [
  {
    id: "hero",
    type: "image",
    src: "/img/detali/60-optimized.webp",
    x: 200,
    y: 700,
    width: 351
  },
  {
    id: "text1",
    type: "text",
    content: "Навигация для жилого комплекса Детали",
    x: 220,
    y: 550,
    width: 351
  }
];

export const initialView: BoardView = {
  x: -100,   // камера смещена на нужный участок
  y: -100,
  zoom: 1
};
