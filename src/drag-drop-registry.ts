import { Draggable, Droppable } from "./index";

export class DragDropRegistry {
  private static _instance: DragDropRegistry;

  static get instance() {
    if (!DragDropRegistry._instance) {
      DragDropRegistry._instance = new DragDropRegistry();
    }
    return DragDropRegistry._instance;
  }

  isDragging = false;
  dragTarget: Draggable;
  dropTarget: Droppable;
}
