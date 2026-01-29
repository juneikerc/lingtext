import { z } from "zod";
import type { CollectionName } from "./types";

export interface CollectionDefinition<TSchema> {
  name: CollectionName;
  directory: string;
  schema: z.ZodType<TSchema>;
}

export const collectionDefinitions = [
  {
    name: "blogs",
    directory: "app/content/blogs",
    schema: z.object({
      slug: z.string(),
      title: z.string(),
      mainHeading: z.string(),
      metaDescription: z.string(),
      image: z.string(),
      tags: z.array(z.string()),
    }),
  },
  {
    name: "levelsTexts",
    directory: "app/content/levelsTexts",
    schema: z.object({
      title: z.string(),
      mainHeading: z.string(),
      metaDescription: z.string(),
      intro: z.string(),
      level: z.enum(["a1", "a2", "b1", "b2", "c1", "c2"]),
    }),
  },
  {
    name: "texts",
    directory: "app/content/texts",
    schema: z.object({
      title: z.string(),
      level: z.enum(["a1", "a2", "b1", "b2", "c1", "c2"]),
      sound: z.string().optional(),
    }),
  },
] satisfies Array<CollectionDefinition<unknown>>;
