import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

function createMarkdownProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify);
}

export async function compileMarkdown(markdown: string): Promise<string> {
  const file = await createMarkdownProcessor().process(markdown);

  return String(file);
}

export function compileMarkdownSync(markdown: string): string {
  const file = createMarkdownProcessor().processSync(markdown);

  return String(file);
}
