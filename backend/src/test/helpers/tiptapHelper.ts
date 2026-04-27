import { TiptapJSON } from "../../domain/Entities/Instructions.js"

export const toTiptapJSON = (text: string): TiptapJSON => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text,
        },
      ],
    },
  ],
})
