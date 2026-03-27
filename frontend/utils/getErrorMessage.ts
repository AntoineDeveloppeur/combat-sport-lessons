import type { BackendError } from "@/types"

export const getErrorMessage = (error: BackendError): string => {
  return error?.data?.error || "Une erreur est survenue"
}
