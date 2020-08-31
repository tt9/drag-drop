import { Draggable } from "./draggable";
import { Droppable } from "./droppable";
import { DragDropConfig } from "./drag-drop-config";
import "./drag-drop.css";

const defaultConfig: DragDropConfig = {
  zIndexBase: 1,
  resetDragPositionOnMouseUp: true,
};
const refs = [];
function initialize(config: DragDropConfig) {
  let processedConfig = { ...defaultConfig, ...config };

  document.querySelectorAll(".draggable").forEach((el) => {
    refs.push(new Draggable(el as HTMLElement, processedConfig));
  });
  document.querySelectorAll(".droppable").forEach((el) => {
    refs.push(new Droppable(el as HTMLElement, processedConfig));
  });
}

export { initialize };
export { Draggable, Droppable };
