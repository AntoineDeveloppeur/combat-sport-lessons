import * as Yup from "yup"
import { type Lesson } from "@/types"
import { type TiptapJSON } from "@/types"

const extractTextFromTiptap = (tiptapJSON: TiptapJSON): string => {
  let text = ""

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traverse = (node: any): void => {
    if (!node) return

    if (typeof node.text === "string") {
      text += node.text
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(traverse)
    }
  }

  traverse(tiptapJSON)
  return text
}

export function getYupValidationSchema(
  fieldName: keyof Lesson
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Yup.ObjectSchema<any> {
  return Yup.object().shape({
    [fieldName]: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.mixed()
            .test("is-required", "L'instruction est requise", function (value) {
              return value !== undefined && value !== null
            })
            .test(
              "min-text-length",
              "L'instruction doit contenir au moins 3 caractères",
              function (value) {
                if (value === undefined || value === null) {
                  return true
                }
                const extractedText = extractTextFromTiptap(value as TiptapJSON)
                return extractedText.length >= 3
              }
            )
            .test(
              "max-text-length",
              "L'instruction ne peut pas dépasser 2000 caractères",
              (value) => {
                if (!value) return true
                const extractedText = extractTextFromTiptap(value as TiptapJSON)
                return extractedText.length <= 2000
              }
            ),
          min: Yup.number()
            .min(0, "Les minutes doivent être au minimum 0")
            .max(90, "Les minutes ne peuvent pas dépasser 90")
            .required("Les minutes sont requises"),
          sec: Yup.number()
            .min(0, "Les secondes doivent être au minimum 0")
            .max(59, "Les secondes ne peuvent pas dépasser 59")
            .required("Les secondes sont requises"),
        })
      )
      .required(),
  })
}
