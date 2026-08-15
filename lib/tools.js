import { tool } from "ai";
import { z } from "zod";
import { searchBooks } from "./books";

export const searchBooksTool = tool({
  description:
    "Search Open Library for books matching a user's query.",

  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .describe("The book title, author, or topic to search for."),
  }),

  execute: async ({ query }) => {
    const books = await searchBooks(query);

    return {
      query,
      results: books.slice(0, 5),
    };
  },
});