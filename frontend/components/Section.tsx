import Link from "next/link"
import React, { ReactNode } from "react"

type SectionProps = {
  title: string
  children: ReactNode
  url: string
}

export const Section = ({ title, children, url }: SectionProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold">{title}</h4>
        <Link
          className="px-4 py-2 rounded font-medium transition-colors bg-gray-600 hover:bg-gray-700 text-white"
          href={url}
        >
          Edit
        </Link>
      </div>
      <div>{children}</div>
    </div>
  )
}

type SectionRowProps = {
  children: ReactNode
}

export const SectionRow = ({ children }: SectionRowProps) => {
  const childArray = React.Children.toArray(children)
  return (
    <div className="flex w-full mb-2">
      <div className="w-1/2">{childArray[0]}</div>
      <div className="w-1/2">{childArray[1]}</div>
    </div>
  )
}
