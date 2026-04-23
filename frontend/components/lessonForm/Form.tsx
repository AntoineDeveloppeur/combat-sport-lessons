import { FormHTMLAttributes, ReactNode } from "react"

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode
}

export const Form = ({ children, ...props }: FormProps) => {
  return (
    <form
      className="w-full mb-8"
      {...props}
      noValidate
    >
      {children}
    </form>
  )
}
