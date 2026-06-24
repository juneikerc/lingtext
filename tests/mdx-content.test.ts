import { describe, expect, it } from "vitest";

import { compileMdx } from "../app/lib/content/mdx";

describe("compileMdx", () => {
  it("renders registered JSX components", async () => {
    const html = await compileMdx(`
<Callout title="Nota" titleAs="h3" tone="tip">

Este texto usa **Markdown** dentro de un componente.

</Callout>
`);

    expect(html).toContain("<div");
    expect(html).toContain("<h3");
    expect(html).toContain("Nota");
    expect(html).toContain("<strong>Markdown</strong>");
    expect(html).toContain("bg-cyan-50");
  });

  it("renders Callout body markdown passed as a string prop", async () => {
    const html = await compileMdx(`
<Callout
  title="Consejo"
  titleAs="h2"
  body={\`Texto con **énfasis** y [enlace](/blog).\`}
/>
`);

    expect(html).toContain("<h2");
    expect(html).toContain("<strong>énfasis</strong>");
    expect(html).toContain('<a href="/blog">enlace</a>');
  });

  it("supports MDX expressions in component props", async () => {
    const html = await compileMdx(`
<LinkButton href={"/blog/" + "input-comprensible"}>Leer más</LinkButton>
`);

    expect(html).toContain('href="/blog/input-comprensible"');
    expect(html).toContain("Leer más");
  });

  it("rejects imports and exports in content files", async () => {
    await expect(
      compileMdx(`
export const value = "bad";

# Title
`)
    ).rejects.toThrow("MDX imports and exports are not supported");
  });
});
