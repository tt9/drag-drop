import { DragDropRegistry } from "./drag-drop-registry";
import { windowRef } from "./window-ref";
import { DragDropConfig } from "./drag-drop-config";

export class Droppable {
  private data: any;
  constructor(public element: HTMLElement, private config: DragDropConfig) {
    this.element.style.zIndex = config.zIndexBase.toString();
    this.data = this.element.getAttribute("data-droptarget");
    this.initializeListeners();
  }

  private initializeListeners() {
    const registry = DragDropRegistry.instance;

    const onMouseUp = (evt: MouseEvent) => {
      if (registry.dropTarget === this) {
        var event = new CustomEvent("droptargetdrop", {
          detail: {
            dragTarget: this,
            dropTarget: registry.dropTarget,
            data: this.data,
          },
        });
        this.element.dispatchEvent(event);
        windowRef.removeEventListener("mouseup", onMouseUp);
      }
    };

    this.element.addEventListener("mouseover", () => {
      if (registry.isDragging) {
        registry.dropTarget = this;

        // Create a new event
        var event = new CustomEvent("droptargetstart");
        // Dispatch the event
        this.element.dispatchEvent(event);

        windowRef.addEventListener("mouseup", onMouseUp);
      }
    });
    this.element.addEventListener("mouseleave", () => {
      if (this.isDropTarget()) {
        registry.dropTarget = null;
        var event = new CustomEvent("droptargetend");
        this.element.dispatchEvent(event);
      }
      windowRef.removeEventListener("mouseup", onMouseUp);
    });
  }

  public isDropTarget() {
    const registry = DragDropRegistry.instance;
    return registry.isDragging && registry.dropTarget === this;
  }
}
