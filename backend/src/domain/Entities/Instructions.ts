export interface TiptapJSON {
  type: "doc"
  content?: Array<{
    type: string
    content?: Array<{
      type: string
      text?: string
      marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
      attrs?: Record<string, unknown>
    }>
    attrs?: Record<string, unknown>
  }>
}

export interface Instruction {
  text: TiptapJSON
  min: number
  sec: number
  order?: number
}
