import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";

import { mdxComponents } from "./mdx-components";

function disallowMdxEsm() {
  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], "mdxjsEsm", () => {
      throw new Error(
        "MDX imports and exports are not supported. Add shared components to app/lib/content/mdx-components.ts."
      );
    });
  };
}

export async function compileMdx(source: string): Promise<string> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm, remarkFrontmatter, disallowMdxEsm],
    rehypePlugins: [rehypeSlug],
  });

  const { default: MDXContent } = await run(String(compiled), {
    ...runtime,
    Fragment: React.Fragment,
    jsx: runtime.jsx,
    jsxs: runtime.jsxs,
  });

  return renderToStaticMarkup(
    React.createElement(MDXContent, {
      components: mdxComponents,
    })
  );
}
