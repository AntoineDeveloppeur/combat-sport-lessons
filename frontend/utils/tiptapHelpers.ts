import { TiptapJSON } from "@/types"

export const createTiptapJSON = (text: string): TiptapJSON => {
  if (!text) {
    return {
      type: "doc",
      content: [],
    }
  }

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  }
}
