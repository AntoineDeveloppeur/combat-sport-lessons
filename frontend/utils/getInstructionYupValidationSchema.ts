import * as Yup from "yup"
import { type Lesson } from "@/types"

export function getYupValidationSchema(
  fieldName: keyof Lesson
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Yup.ObjectSchema<any> {
  return Yup.object().shape({
    [fieldName]: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string()
            .min(3, "L'instruction doit contenir au moins 3 caractères")
            .max(2000, "L'instruction ne peut pas dépasser 2000 caractères")
            .required("L'instruction est requise"),
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
