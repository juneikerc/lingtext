import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const levelsTexts = defineCollection({
  name: "levelsTexts",
  directory: "app/content/levelsTexts",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    mainHeading: z.string(),
    metaDescription: z.string(),
    intro: z.string(),
    level: z.enum(["a1", "a2", "b1", "b2", "c1", "c2"]),
    content: z.string(),
  }),
});

const texts = defineCollection({
  name: "texts",
  directory: "app/content/texts",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    level: z.enum(["a1", "a2", "b1", "b2", "c1", "c2"]),
    content: z.string(),
  }),
});

export default defineConfig({
  collections: [texts, levelsTexts],
});
