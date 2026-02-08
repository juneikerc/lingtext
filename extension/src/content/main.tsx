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

.lingtext-popup {
  position: absolute;
  min-width: 280px;
  max-width: 350px;
  background: #ffffff;
  color: #1f2937;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  pointer-events: auto;
  transform: translateX(-50%) translateY(-100%);
  margin-top: -10px;
}

.lingtext-selection-popup {
  position: absolute;
  min-width: 250px;
  max-width: 400px;
  background: #ffffff;
  color: #1f2937;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  pointer-events: auto;
  transform: translateX(-50%) translateY(-100%);
  margin-top: -10px;
  padding: 16px;
}

.lingtext-popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.lingtext-popup-word {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lingtext-popup-word strong {
  font-size: 18px;
  color: #111827;
}

.lingtext-popup-icon {
  font-size: 20px;
}

.lingtext-popup-speak,
.lingtext-popup-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.lingtext-popup-speak:hover,
.lingtext-popup-close:hover {
  background: #e5e7eb;
}

.lingtext-popup-body {
  padding: 16px;
}

.lingtext-popup-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.lingtext-popup-translation {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.lingtext-popup-category {
  margin-bottom: 4px;
}

.lingtext-popup-category-name {
  font-weight: 600;
  color: #4b5563;
  margin-right: 4px;
}

.lingtext-popup-status {
  margin-bottom: 12px;
}

.lingtext-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.lingtext-status-badge.unknown {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.lingtext-status-badge.known {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.lingtext-popup-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lingtext-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.lingtext-btn-known {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.lingtext-btn-known:hover {
  background: #a7f3d0;
}

.lingtext-btn-unknown {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.lingtext-btn-unknown:hover {
  background: #fde68a;
}

.lingtext-btn-save {
  background: #2563eb;
  color: #ffffff;
  border: 1px solid #1d4ed8;
}

.lingtext-btn-save:hover {
  background: #1d4ed8;
}

.lingtext-selection-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.lingtext-selection-text {
  font-style: italic;
  color: #4b5563;
  font-size: 15px;
  flex: 1;
  margin-right: 8px;
}

.lingtext-selection-translation {
  margin-bottom: 12px;
}

.lingtext-translation-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  white-space: pre-wrap;
}

.lingtext-selection-actions {
  display: flex;
  gap: 8px;
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
