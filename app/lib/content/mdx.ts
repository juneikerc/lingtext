import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";

function disallowMdxJsx() {
  return (tree: unknown) => {
    visit(
      tree as any,
      [
        "mdxJsxFlowElement",
        "mdxJsxTextElement",
        "mdxFlowExpression",
        "mdxTextExpression",
        "mdxjsEsm",
      ],
      () => {
        throw new Error(
          "MDX JSX components are not supported. Use Markdown-only syntax."
        );
      }
    );
  };
}

export async function compileMdx(source: string): Promise<string> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm, remarkFrontmatter, disallowMdxJsx],
    rehypePlugins: [rehypeSlug],
  });

  const { default: MDXContent } = await run(String(compiled), {
    ...runtime,
    Fragment: React.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
  });

  return renderToStaticMarkup(React.createElement(MDXContent));
}
