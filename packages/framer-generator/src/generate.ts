export function generateFramerClipboard(uiTree: any): string {
  const clipboardPayload = {
    __framer__: true,
    data: uiTree,
  };
  return JSON.stringify(clipboardPayload);
}
