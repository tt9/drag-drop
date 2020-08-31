let windowRef = window;

if (!windowRef) {
  windowRef = <any>{};
  console.debug("No window found, initializing to empty object");
}

export { windowRef };
