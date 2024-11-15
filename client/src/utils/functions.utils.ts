const getCenterOfElementInContainer = (
  elem: HTMLElement,
  container: HTMLElement,
): { x: number; y: number } => {
  const rect = elem.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const centerX = rect.left - containerRect.left + rect.width / 2;
  const centerY = rect.top - containerRect.top + rect.height / 2;
  return { x: centerX, y: centerY };
};

export { getCenterOfElementInContainer };
