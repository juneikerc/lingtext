import { createRoot } from "react-dom/client";

import OverlayRoot from "./overlay-root";

const ROOT_ID = "lingtext-root";

const STYLES = `
.lingtext-wrapper {
  pointer-events: none;
}

.lingtext-container {
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  width: min(90%, 980px);
  text-align: center;
  pointer-events: auto;
  opacity: 1;
  transition: opacity 0.12s ease-in-out;
}

.lingtext-container.lingtext-transitioning {
  opacity: 0.78;
}

.lingtext-subtitle-overlay {
  display: inline;
  background: rgba(10, 10, 10, 0.86);
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: clamp(20px, 2.05vw, 30px);
  line-height: 1.35;
  font-family: "YouTube Noto", Roboto, Arial, sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.lingtext-word {
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.lingtext-word:hover {
  background: rgba(59, 130, 246, 0.42);
}

.lingtext-unknown {
  background: rgba(234, 179, 8, 0.26);
  border-bottom: 2px solid rgba(234, 179, 8, 0.7);
  font-weight: 600;
}

.lingtext-unknown:hover {
  background: rgba(234, 179, 8, 0.38);
}

.lingtext-phrase {
  text-decoration: underline;
  text-decoration-color: #4ade80;
  text-underline-offset: 4px;
}

.lingtext-reader-popup {
  --reader-surface-bg: rgba(255, 255, 255, 0.97);
  --reader-muted-bg: rgba(249, 250, 251, 0.97);
  --reader-text-color: #111827;
  --reader-muted-text-color: #6b7280;
  --reader-border-color: rgba(229, 231, 235, 0.95);
  --reader-accent-color: #0f9eda;
  position: fixed;
  z-index: 2147483647;
  background: var(--reader-surface-bg);
  color: var(--reader-text-color);
  border: 1px solid var(--reader-border-color);
  border-radius: 16px;
  box-shadow: 0 20px 42px rgba(15, 23, 42, 0.22);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  pointer-events: auto;
  backdrop-filter: blur(12px);
}

.lingtext-reader-popup * {
  box-sizing: border-box;
}

.lingtext-reader-popup button {
  font-family: inherit;
}

.lingtext-reader-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--reader-border-color);
  background: var(--reader-muted-bg);
}

.lingtext-reader-popup-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.lingtext-reader-popup-title-group.compact {
  gap: 10px;
}

.lingtext-reader-popup-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: rgba(15, 158, 218, 0.12);
  color: var(--reader-accent-color);
}

.lingtext-reader-popup-icon.small {
  width: 32px;
  height: 32px;
}

.lingtext-reader-popup-icon svg,
.lingtext-reader-icon-button svg,
.lingtext-reader-action-button svg {
  width: 16px;
  height: 16px;
}

.lingtext-reader-popup-title {
  min-width: 0;
}

.lingtext-reader-popup-title h3 {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.lingtext-reader-popup-title p {
  margin: 2px 0 0;
  color: var(--reader-muted-text-color);
  font-size: 11px;
  line-height: 1.2;
}

.lingtext-reader-selection-title {
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
}

.lingtext-reader-popup-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.lingtext-reader-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.lingtext-reader-icon-button:hover {
  background: rgba(243, 244, 246, 0.9);
  color: #374151;
}

.lingtext-reader-icon-button:focus-visible,
.lingtext-reader-action-button:focus-visible {
  outline: 2px solid rgba(15, 158, 218, 0.55);
  outline-offset: 2px;
}

.lingtext-reader-section {
  padding: 12px 16px;
}

.lingtext-reader-section-compact {
  padding-bottom: 8px;
}

.lingtext-reader-section.no-bottom-padding {
  padding-bottom: 0;
}

.lingtext-reader-status-section {
  padding-top: 4px;
  padding-bottom: 8px;
}

.lingtext-reader-card {
  padding: 12px;
  border: 1px solid var(--reader-border-color);
  border-radius: 12px;
  background: var(--reader-muted-bg);
}

.lingtext-reader-card.accent {
  background: rgba(15, 158, 218, 0.05);
  border-color: rgba(15, 158, 218, 0.1);
}

.lingtext-reader-card.selected-text p {
  margin: 0;
  color: #374151;
  font-size: 14px;
  font-style: italic;
  line-height: 1.55;
}

.lingtext-reader-translation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lingtext-reader-category {
  margin: 0 0 2px;
  color: rgba(17, 24, 39, 0.5);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-transform: uppercase;
}

.lingtext-reader-category.accent {
  color: rgba(15, 158, 218, 0.7);
}

.lingtext-reader-translation-text {
  margin: 0;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.4;
}

.lingtext-reader-main-translation {
  display: inline-block;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
}

.lingtext-reader-selection-translation {
  display: inline-block;
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
}

.lingtext-reader-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.lingtext-reader-status-badge span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.lingtext-reader-status-badge.unknown {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.lingtext-reader-status-badge.unknown span {
  background: #f97316;
}

.lingtext-reader-status-badge.known {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.lingtext-reader-status-badge.known span {
  background: #22c55e;
}

.lingtext-reader-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 16px 16px;
}

.lingtext-reader-actions.with-border {
  padding-top: 12px;
  border-top: 1px solid var(--reader-border-color);
  background: var(--reader-surface-bg);
}

.lingtext-reader-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 42px;
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.lingtext-reader-action-button:hover {
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}

.lingtext-reader-action-button.known {
  background: #f0fdf4;
  color: #15803d;
  border-color: #bbf7d0;
}

.lingtext-reader-action-button.known:hover {
  background: #dcfce7;
}

.lingtext-reader-action-button.unknown {
  background: #fff7ed;
  color: #c2410c;
  border-color: #fed7aa;
}

.lingtext-reader-action-button.unknown:hover {
  background: #ffedd5;
}

.lingtext-reader-action-button.secondary {
  background: var(--reader-muted-bg);
  color: #4b5563;
  border-color: var(--reader-border-color);
}

.lingtext-reader-action-button.secondary:hover {
  background: #f9fafb;
}
`;

function init() {
  if (document.getElementById(ROOT_ID)) {
    return;
  }

  const host = document.createElement("div");
  host.id = ROOT_ID;
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = STYLES;
  shadowRoot.appendChild(style);

  const mountNode = document.createElement("div");
  shadowRoot.appendChild(mountNode);

  const root = createRoot(mountNode);
  root.render(<OverlayRoot shadowRoot={shadowRoot} />);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
