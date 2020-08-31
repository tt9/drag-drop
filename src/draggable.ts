import { windowRef } from "./window-ref";
import { DragDropRegistry } from "./drag-drop-registry";
import { DragDropConfig } from "./drag-drop-config";

export class Draggable {
  protected dragState: {
    curX?: number;
    curY?: number;
    clientX?: number;
    clientY?: number;
    isDragging?: boolean;
    startX?: number;
    startY?: number;
    scrollY?: number;
    scrollX?: number;
  } = {};
  protected data: any;

  constructor(public element: HTMLElement, private config: DragDropConfig) {
    this.element.style.zIndex = (config.zIndexBase + 1).toString();
    this.data = this.element.getAttribute("data-dragtarget");
    this.initializeListeners();
  }
  public reset() {
    this.dragState = {};
  }

  private initializeListeners() {
    const onMouseMove = (e: MouseEvent) => {
      if (!this.dragState.isDragging) {
        return;
      }
      this.dragState = {
        ...this.dragState,
        curX: e.pageX,
        curY: e.pageY,
      };
      this.setElementTranslation();
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!this.dragState.isDragging) {
        return;
      }
      const registry = DragDropRegistry.instance;

      this.element.style.pointerEvents = "all";

      this.dragState = {
        isDragging: false,
        curX: this.config.resetDragPositionOnMouseUp ? 0 : e.pageX,
        curY: this.config.resetDragPositionOnMouseUp ? 0 : e.pageY,
        clientX: this.config.resetDragPositionOnMouseUp ? 0 : e.clientX,
        clientY: this.config.resetDragPositionOnMouseUp ? 0 : e.clientY,
        scrollX: this.config.resetDragPositionOnMouseUp
          ? 0
          : document.scrollingElement.scrollLeft,
        scrollY: this.config.resetDragPositionOnMouseUp
          ? 0
          : document.scrollingElement.scrollTop,
      };

      this.setElementTranslation();

      const dropEvent = new CustomEvent("dragtargetdrop", {
        detail: {
          dragTarget: registry.dragTarget,
          dropTarget: registry.dropTarget,
          onDropTarget: !!registry.dropTarget,
          dragX: this.dragState.curX - this.dragState.clientX,
          dragY: this.dragState.curY - this.dragState.clientY,
          data: this.data,
        },
      });
      this.element.dispatchEvent(dropEvent);

      registry.isDragging = false;
      registry.dragTarget = null;

      windowRef.removeEventListener("mousemove", onMouseMove);
      windowRef.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (this.dragState.isDragging) {
        return;
      }
      this.element.style.pointerEvents = "none";
      this.dragState = {
        isDragging: true,
        curX: e.pageX,
        curY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        scrollX: document.scrollingElement.scrollLeft,
        scrollY: document.scrollingElement.scrollTop,
      };

      DragDropRegistry.instance.isDragging = true;
      DragDropRegistry.instance.dragTarget = this;

      this.setElementTranslation();
      windowRef.addEventListener("mousemove", onMouseMove);
      windowRef.addEventListener("mouseup", onMouseUp);
    };

    this.element.addEventListener("mousedown", onMouseDown);
  }

  private setElementTranslation() {
    const ptX =
      this.dragState.curX - this.dragState.clientX - this.dragState.scrollX;
    const ptY =
      this.dragState.curY - this.dragState.clientY - this.dragState.scrollY;

    this.element.style.transform = `translate(${ptX}px, ${ptY}px)`;
  }

  dispose() {}
}
