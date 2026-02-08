const STYLE_ID = "lingtext-native-caption-hide";

export function setNativeCcHidden(hidden: boolean): void {
  const existing = document.getElementById(STYLE_ID);

  if (!hidden) {
    existing?.remove();
    return;
  }

  if (existing) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .ytp-caption-window-container {
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;

  document.head.appendChild(style);
}
