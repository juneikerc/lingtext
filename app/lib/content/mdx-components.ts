import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { compileMarkdownSync } from "./markdown";

// This module is loaded by Vite's content plugin while vite.config.ts is being
// evaluated. Keep components SSR-safe and avoid app aliases such as "~/*" here.

type CalloutTone = "info" | "tip" | "warning";
type CalloutTitleElement = "h2" | "h3" | "h4";

interface CalloutProps extends ComponentPropsWithoutRef<"div"> {
  body?: string;
  children?: ReactNode;
  title?: string;
  titleAs?: CalloutTitleElement;
  tone?: CalloutTone;
}

const calloutStyles: Record<
  CalloutTone,
  {
    body: string;
    header: string;
    title: string;
  }
> = {
  info: {
    body: "border-indigo-300 bg-indigo-50/40 text-gray-900 shadow-indigo-100/70",
    header: "border-indigo-300 bg-indigo-600",
    title: "text-white",
  },
  tip: {
    body: "border-cyan-300 bg-cyan-50/50 text-gray-900 shadow-cyan-100/80",
    header: "border-cyan-300 bg-cyan-700",
    title: "text-white",
  },
  warning: {
    body: "border-amber-300 bg-amber-50/60 text-gray-900 shadow-amber-100/80",
    header: "border-amber-300 bg-amber-500",
    title: "text-white",
  },
};

function Callout({
  body,
  children,
  className = "",
  title,
  titleAs = "h2",
  tone = "info",
  ...props
}: CalloutProps) {
  const toneClasses = calloutStyles[tone] ?? calloutStyles.info;
  const bodyHtml = typeof body === "string" ? compileMarkdownSync(body) : null;

  return React.createElement(
    "div",
    {
      className:
        `not-prose my-10 overflow-hidden rounded-lg border-2 shadow-lg ${toneClasses.body} ${className}`.trim(),
      ...props,
    },
    title
      ? React.createElement(
          "div",
          {
            className: `border-b px-6 py-4 ${toneClasses.header}`,
          },
          React.createElement(
            titleAs,
            {
              className: `m-0 text-xl font-bold leading-snug ${toneClasses.title}`,
            },
            title
          )
        )
      : null,
    React.createElement(
      "div",
      {
        className:
          "prose prose-gray max-w-none px-6 py-6 text-[1.02rem] leading-8 prose-p:my-0 prose-p:leading-8 [&_p+p]:mt-5 [&_a]:font-semibold",
        ...(bodyHtml
          ? {
              dangerouslySetInnerHTML: {
                __html: bodyHtml,
              },
            }
          : {}),
      },
      bodyHtml ? undefined : children
    )
  );
}

interface LinkButtonProps extends ComponentPropsWithoutRef<"a"> {
  children: ReactNode;
  href: string;
}

function LinkButton({
  children,
  className = "",
  href,
  ...props
}: LinkButtonProps) {
  return React.createElement(
    "a",
    {
      className:
        `not-prose inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`.trim(),
      href,
      ...props,
    },
    children
  );
}

export const mdxComponents = {
  Callout,
  LinkButton,
};
