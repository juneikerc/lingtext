export type UrlImportStrategy = "browser" | "server";

export type UrlImportErrorCode =
  | "invalid_url"
  | "unsupported_environment"
  | "request_failed"
  | "non_html_content"
  | "empty_content"
  | "no_readable_content";

export interface UrlImportSuccessResult {
  ok: true;
  strategy: UrlImportStrategy;
  sourceUrl: string;
  title: string;
  markdown: string;
}

export interface UrlImportErrorResult {
  ok: false;
  strategy: UrlImportStrategy;
  code: UrlImportErrorCode;
  message: string;
}

export type UrlImportResult = UrlImportSuccessResult | UrlImportErrorResult;

export interface ImportHtmlFromUrlOptions {
  allowServerFallback?: boolean;
  fetchImpl?: typeof fetch;
  serverFallbackImporter?: (url: string) => Promise<UrlImportResult>;
}

interface MarkdownRenderContext {
  inPre?: boolean;
  inHeading?: boolean;
  baseUrl?: URL;
}

const BLOCK_SELECTOR = [
  "article",
  "main article",
  "main",
  "[role='main']",
  ".post-content",
  ".entry-content",
  ".article-content",
  ".story-content",
  ".content",
  ".main-content",
].join(", ");

const REMOVE_SELECTOR = [
  "script",
  "style",
  "noscript",
  "iframe",
  "canvas",
  "svg",
  "nav",
  "header",
  "footer",
  "aside",
  "form",
  "button",
  "input",
  "select",
  "textarea",
  "dialog",
  "[aria-hidden='true']",
  ".ads",
  ".advertisement",
  ".social-share",
  ".share",
  ".cookie",
  ".cookies",
  ".newsletter",
  ".subscribe",
].join(", ");

export async function importHtmlFromUrl(
  url: string,
  options: ImportHtmlFromUrlOptions = {}
): Promise<UrlImportResult> {
  const normalizedUrl = normalizeImportUrl(url);

  if (!normalizedUrl) {
    return {
      ok: false,
      strategy: "browser",
      code: "invalid_url",
      message:
        "Ingresa una URL valida que empiece con http:// o https://, o un dominio accesible como ejemplo.com.",
    };
  }

  const browserResult = await importHtmlFromBrowser(
    normalizedUrl,
    options.fetchImpl
  );

  if (browserResult.ok || !options.allowServerFallback) {
    return browserResult;
  }

  if (!options.serverFallbackImporter) {
    return browserResult;
  }

  return options.serverFallbackImporter(normalizedUrl.toString());
}

function normalizeImportUrl(input: string): URL | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);

    if (!parsed.hostname || !["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function importHtmlFromBrowser(
  url: URL,
  fetchImpl: typeof fetch = fetch
): Promise<UrlImportResult> {
  if (typeof DOMParser === "undefined") {
    return {
      ok: false,
      strategy: "browser",
      code: "unsupported_environment",
      message: "La importacion desde URL solo esta disponible en el navegador.",
    };
  }

  try {
    const response = await fetchImpl(url.toString(), {
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        strategy: "browser",
        code: "request_failed",
        message: `No se pudo importar la pagina. El sitio respondio con estado ${response.status}.`,
      };
    }

    const contentType = (
      response.headers.get("content-type") || ""
    ).toLowerCase();
    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      return {
        ok: false,
        strategy: "browser",
        code: "non_html_content",
        message: "La URL no devolvio una pagina HTML compatible para importar.",
      };
    }

    const responseUrl = new URL(response.url || url.toString());
    const html = await response.text();
    if (!html.trim()) {
      return {
        ok: false,
        strategy: "browser",
        code: "empty_content",
        message: "La pagina no devolvio contenido util para importar.",
      };
    }

    const document = new DOMParser().parseFromString(html, "text/html");
    const contentRoot = extractContentRoot(document);

    if (!contentRoot) {
      return {
        ok: false,
        strategy: "browser",
        code: "no_readable_content",
        message:
          "No pude encontrar contenido principal legible en esta pagina.",
      };
    }

    absolutizeResourceUrls(contentRoot, responseUrl);
    const markdown = htmlNodeToMarkdown(contentRoot, {
      baseUrl: responseUrl,
    }).trim();

    if (!markdown) {
      return {
        ok: false,
        strategy: "browser",
        code: "no_readable_content",
        message: "No pude transformar esta pagina en markdown legible.",
      };
    }

    return {
      ok: true,
      strategy: "browser",
      sourceUrl: responseUrl.toString(),
      title: extractDocumentTitle(document, responseUrl),
      markdown,
    };
  } catch {
    return {
      ok: false,
      strategy: "browser",
      code: "request_failed",
      message:
        "No se pudo acceder a esta pagina directamente desde el navegador. Es posible que el sitio bloquee solicitudes externas por CORS o que la URL no este disponible.",
    };
  }
}

function extractDocumentTitle(document: Document, url: URL): string {
  const candidates = [
    document
      .querySelector("meta[property='og:title']")
      ?.getAttribute("content"),
    document
      .querySelector("meta[name='twitter:title']")
      ?.getAttribute("content"),
    document.querySelector("h1")?.textContent,
    document.title,
    url.hostname,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeWhitespace(candidate || "");
    if (normalized) {
      return normalized;
    }
  }

  return "Texto importado desde URL";
}

function extractContentRoot(document: Document): HTMLElement | null {
  const clonedBody = document.body?.cloneNode(true);
  if (!(clonedBody instanceof HTMLElement)) {
    return null;
  }

  for (const node of clonedBody.querySelectorAll(REMOVE_SELECTOR)) {
    node.remove();
  }

  const candidates = Array.from(clonedBody.querySelectorAll(BLOCK_SELECTOR));
  const scoredCandidates = candidates
    .map((candidate) => ({
      candidate,
      score: scoreContentCandidate(candidate),
    }))
    .filter(({ score }) => score > 120)
    .sort((a, b) => b.score - a.score);

  if (scoredCandidates.length > 0) {
    return scoredCandidates[0].candidate as HTMLElement;
  }

  if (scoreContentCandidate(clonedBody) > 120) {
    return clonedBody;
  }

  return null;
}

function scoreContentCandidate(element: Element): number {
  const paragraphText = Array.from(element.querySelectorAll("p"))
    .map((paragraph) => normalizeWhitespace(paragraph.textContent || ""))
    .join(" ");

  const headingText = Array.from(element.querySelectorAll("h1, h2, h3"))
    .map((heading) => normalizeWhitespace(heading.textContent || ""))
    .join(" ");

  return paragraphText.length + headingText.length * 1.5;
}

function absolutizeResourceUrls(root: Element, baseUrl: URL) {
  for (const link of root.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    const absoluteHref = absolutizeUrl(href, baseUrl);

    if (absoluteHref) {
      link.setAttribute("href", absoluteHref);
    }
  }

  for (const image of root.querySelectorAll("img")) {
    const absoluteSrc = extractBestImageSource(image, baseUrl);

    if (absoluteSrc) {
      image.setAttribute("src", absoluteSrc);
    }
  }
}

function extractBestImageSource(image: Element, baseUrl: URL): string | null {
  const directCandidates = [
    image.getAttribute("src"),
    image.getAttribute("data-src"),
    image.getAttribute("data-original"),
    image.getAttribute("data-url"),
    image.getAttribute("data-lazy-src"),
  ];

  for (const candidate of directCandidates) {
    const normalized = normalizeImportedImageUrl(candidate, baseUrl);
    if (normalized) {
      return normalized;
    }
  }

  const setCandidates = [
    image.getAttribute("srcset"),
    image.getAttribute("data-srcset"),
  ];

  for (const candidate of setCandidates) {
    const bestFromSet = pickBestSrcsetCandidate(candidate);
    const normalized = normalizeImportedImageUrl(bestFromSet, baseUrl);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function pickBestSrcsetCandidate(srcset: string | null): string | null {
  if (!srcset) {
    return null;
  }

  const entries = srcset
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (entries.length === 0) {
    return null;
  }

  const lastEntry = entries[entries.length - 1];
  return lastEntry.split(/\s+/)[0] || null;
}

function normalizeImportedImageUrl(
  value: string | null,
  baseUrl: URL
): string | null {
  const absolute = absolutizeUrl(value, baseUrl);

  if (!absolute) {
    return null;
  }

  return unwrapImageProxyUrl(absolute) || absolute;
}

function unwrapImageProxyUrl(value: string): string | null {
  try {
    const parsed = new URL(value);
    const isNextImageProxy = parsed.pathname.includes("_next/image");
    const proxiedUrl = parsed.searchParams.get("url");

    if (isNextImageProxy && proxiedUrl) {
      const decodedUrl = decodeURIComponent(proxiedUrl);
      if (/^https?:\/\//i.test(decodedUrl)) {
        return decodedUrl;
      }

      if (decodedUrl.startsWith("/")) {
        return new URL(decodedUrl, parsed.origin).toString();
      }
    }

    return null;
  } catch {
    return null;
  }
}

function absolutizeUrl(value: string | null, baseUrl: URL): string | null {
  if (!value || value.startsWith("data:")) {
    return value;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function htmlNodeToMarkdown(
  node: Node,
  context: MarkdownRenderContext = {}
): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return context.inPre
      ? node.textContent || ""
      : normalizeInlineWhitespace(node.textContent || "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  if (context.inHeading && shouldOmitHeadingElement(element)) {
    return "";
  }

  switch (tagName) {
    case "body":
    case "main":
    case "article":
    case "section":
    case "div":
      return joinMarkdownBlocks(
        Array.from(element.childNodes).map((child) =>
          htmlNodeToMarkdown(child, context)
        )
      );
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6": {
      const level = Number(tagName.substring(1));
      return `\n\n${"#".repeat(level)} ${renderInlineChildren(element, {
        ...context,
        inHeading: true,
      })}\n\n`;
    }
    case "p":
      return `\n\n${renderInlineChildren(element, context)}\n\n`;
    case "br":
      return "\n";
    case "hr":
      return "\n\n---\n\n";
    case "blockquote": {
      const quote = joinMarkdownBlocks(
        Array.from(element.childNodes).map((child) =>
          htmlNodeToMarkdown(child, context)
        )
      )
        .split("\n")
        .map((line) => (line.trim() ? `> ${line}` : ">"))
        .join("\n");

      return `\n\n${quote}\n\n`;
    }
    case "ul":
      return `\n${renderList(element, false, context)}\n`;
    case "ol":
      return `\n${renderList(element, true, context)}\n`;
    case "pre": {
      const code = element.textContent?.trimEnd() || "";
      if (!code) {
        return "";
      }

      return `\n\n\`\`\`\n${code}\n\`\`\`\n\n`;
    }
    case "figure":
      return joinMarkdownBlocks(
        Array.from(element.childNodes).map((child) =>
          htmlNodeToMarkdown(child, context)
        )
      );
    case "img": {
      const src = context.baseUrl
        ? extractBestImageSource(element, context.baseUrl)
        : element.getAttribute("src");
      if (!src) {
        return "";
      }

      const alt = escapeMarkdownText(
        normalizeWhitespace(element.getAttribute("alt") || "")
      );
      return `\n\n![${alt}](${src})\n\n`;
    }
    case "code":
      if (context.inPre) {
        return element.textContent || "";
      }

      return `\`${escapeInlineCode(element.textContent || "")}\``;
    case "strong":
    case "b":
      return wrapInline("**", renderInlineChildren(element, context));
    case "em":
    case "i":
      return wrapInline("*", renderInlineChildren(element, context));
    case "a": {
      const href = element.getAttribute("href");
      const label = renderInlineChildren(element, context);

      if (context.inHeading) {
        if (shouldOmitHeadingAnchor(element, label, href)) {
          return "";
        }

        return label;
      }

      const fallbackLabel = label || href || "enlace";

      if (!href) {
        return fallbackLabel;
      }

      if (shouldRenderLinkAsPlainText(href, context)) {
        return fallbackLabel;
      }

      return `[${fallbackLabel}](${href})`;
    }
    case "li":
      return renderInlineChildren(element, context);
    default:
      return renderInlineChildren(element, context);
  }
}

function renderList(
  list: HTMLElement,
  ordered: boolean,
  context: MarkdownRenderContext = {}
): string {
  return Array.from(list.children)
    .filter((child) => child.tagName.toLowerCase() === "li")
    .map((child, index) => {
      const itemText = joinMarkdownBlocks(
        Array.from(child.childNodes).map((nestedChild) =>
          htmlNodeToMarkdown(nestedChild, context)
        )
      )
        .split("\n")
        .filter(Boolean)
        .join(" ");

      const marker = ordered ? `${index + 1}.` : "-";
      return `${marker} ${itemText}`.trim();
    })
    .filter(Boolean)
    .join("\n");
}

function renderInlineChildren(
  element: HTMLElement,
  context: MarkdownRenderContext = {}
): string {
  return Array.from(element.childNodes)
    .map((child) => htmlNodeToMarkdown(child, context))
    .join("")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function shouldOmitHeadingElement(element: HTMLElement): boolean {
  const tagName = element.tagName.toLowerCase();
  const className =
    typeof element.className === "string"
      ? element.className.toLowerCase()
      : "";
  const ariaHidden = element.getAttribute("aria-hidden") === "true";
  const role = (element.getAttribute("role") || "").toLowerCase();
  const text = normalizeWhitespace(element.textContent || "").toLowerCase();
  const hasDecorativeClass =
    className.includes("badge") ||
    className.includes("tag") ||
    className.includes("label") ||
    className.includes("eyebrow") ||
    className.includes("kicker") ||
    className.includes("icon") ||
    className.includes("anchor") ||
    className.includes("permalink");

  if (["svg", "img", "picture"].includes(tagName)) {
    return true;
  }

  if (ariaHidden || role === "presentation") {
    return true;
  }

  if (hasDecorativeClass) {
    return true;
  }

  if (["small", "sup", "sub"].includes(tagName)) {
    return ["new", "beta", "alpha", "preview"].includes(text);
  }

  return false;
}

function shouldRenderLinkAsPlainText(
  href: string,
  context: MarkdownRenderContext
): boolean {
  const trimmedHref = href.trim();

  if (!trimmedHref) {
    return true;
  }

  if (
    trimmedHref.startsWith("#") ||
    /^javascript:/i.test(trimmedHref) ||
    /^data:/i.test(trimmedHref)
  ) {
    return true;
  }

  if (!context.baseUrl) {
    return false;
  }

  try {
    const resolvedUrl = new URL(trimmedHref, context.baseUrl);
    if (["mailto:", "tel:"].includes(resolvedUrl.protocol)) {
      return false;
    }

    if (!["http:", "https:"].includes(resolvedUrl.protocol)) {
      return true;
    }

    return resolvedUrl.origin === context.baseUrl.origin;
  } catch {
    return true;
  }
}

function shouldOmitHeadingAnchor(
  element: HTMLElement,
  label: string,
  href: string | null
): boolean {
  const normalizedLabel = normalizeWhitespace(label).toLowerCase();
  const normalizedHref = (href || "").trim().toLowerCase();
  const className =
    typeof element.className === "string" ? element.className : "";
  const rel = (element.getAttribute("rel") || "").toLowerCase();
  const ariaLabel = normalizeWhitespace(
    element.getAttribute("aria-label") || ""
  ).toLowerCase();
  const title = normalizeWhitespace(
    element.getAttribute("title") || ""
  ).toLowerCase();

  if (
    !normalizedLabel &&
    (normalizedHref.startsWith("#") || /#.+$/.test(normalizedHref))
  ) {
    return true;
  }

  if (
    ["#", "¶", "§", "link", "anchor", "permalink"].includes(normalizedLabel)
  ) {
    return true;
  }

  if (
    ariaLabel.includes("permalink") ||
    ariaLabel.includes("anchor") ||
    title.includes("permalink") ||
    title.includes("anchor")
  ) {
    return true;
  }

  if (
    className.includes("anchor") ||
    className.includes("permalink") ||
    rel.includes("bookmark")
  ) {
    return normalizedHref.startsWith("#") || /#.+$/.test(normalizedHref);
  }

  return false;
}

function wrapInline(wrapper: string, text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  return `${wrapper}${trimmed}${wrapper}`;
}

function joinMarkdownBlocks(blocks: string[]): string {
  return blocks
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeInlineWhitespace(value: string): string {
  return value.replace(/\s+/g, " ");
}

function escapeMarkdownText(value: string): string {
  return value.replace(/[[\]]/g, "\\$&");
}

function escapeInlineCode(value: string): string {
  return value.replace(/`/g, "\\`");
}
