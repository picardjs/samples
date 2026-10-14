declare module 'simplehtml/column' {
  const column: {
    mount(container: HTMLElement): void;
    unmount(container: HTMLElement): void;
  };
  export default column;
}
