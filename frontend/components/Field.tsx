import React, { ReactNode } from "react"

type FieldProps = {
  children: ReactNode
  label: string
  error?: { message?: string }
}

export const Field = ({ children, label, error }: FieldProps) => {
  const id = getChildId(children)

  return (
    <div className="w-full mb-3">
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
      </label>
      {children}
      {error && (
        <small className="block mt-1 text-sm text-red-600">
          {error.message}
        </small>
      )}
    </div>
  )
}

export const getChildId = (children: ReactNode): string | undefined => {
  const child = React.Children.only(children) as React.ReactElement<{
    id?: string
  }>
  return child?.props?.id
}
