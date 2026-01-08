export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Escape HTML entities first to prevent XSS
  html = html.replace(/&/g, "&amp;");
  html = html.replace(/</g, "&lt;");
  html = html.replace(/>/g, "&gt;");

  // Headers (h1-h6)
  html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
  html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

  // Italic (*text*)
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/gim,
    '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline">$1</a>'
  );

  // Unordered lists (- item)
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>');

  // Wrap list items in ul tags (simple approach)
  // This is a basic implementation - for complex nested lists, a more sophisticated parser would be needed
  html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/gim, (match) => {
    return `<ul class="list-disc my-4">${match}</ul>`;
  });

  // Ordered lists (1. item, 2. item, etc.)
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>');

  // Wrap ordered list items in ol tags
  html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/gim, (match) => {
    // Check if this was already wrapped in ul
    if (!match.includes("<ul")) {
      return `<ol class="list-decimal my-4">${match}</ol>`;
    }
    return match;
  });

  // Line breaks (single line break becomes <br>)
  html = html.replace(/\n/gim, "<br />");

  // Remove extra <br /> before headers
  html = html.replace(/<br \/><h([1-6])>/gim, "<h$1>");

  // Remove extra <br /> after headers
  html = html.replace(/<\/h([1-6])><br \/>/gim, "</h$1>");

  // Remove extra <br /> before lists
  html = html.replace(/<br \/><ul/gim, "<ul");
  html = html.replace(/<br \/><ol/gim, "<ol");

  // Remove extra <br /> after lists
  html = html.replace(/<\/ul><br \/>/gim, "</ul>");
  html = html.replace(/<\/ol><br \/>/gim, "</ol>");

  // Remove extra <br /> before list items
  html = html.replace(/<br \/><li/gim, "<li");

  // Remove extra <br /> after list items
  html = html.replace(/<\/li><br \/>/gim, "</li>");

  // Wrap remaining content in paragraphs (simple approach)
  // Split by double line breaks first to identify paragraphs
  const paragraphs = html.split(/<br \/><br \/>/);
  html = paragraphs
    .map((p) => {
      p = p.trim();
      // Don't wrap if it's already wrapped in a block element
      if (
        p.startsWith("<h") ||
        p.startsWith("<ul") ||
        p.startsWith("<ol") ||
        p.startsWith("<li") ||
        p === ""
      ) {
        return p;
      }
      return `<p class="my-4">${p}</p>`;
    })
    .join("");

  return html;
}
