export interface BoardBlock {
  id: string;
  type: "image" | "text";
  x: number;
  y: number;
  width: number;
  src?: string;
  content?: string;
}

export interface BoardView {
  x: number;
  y: number;
  zoom: number;
}
