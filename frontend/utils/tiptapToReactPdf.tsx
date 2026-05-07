import React from "react"
import { Text, View, Link, StyleSheet } from "@react-pdf/renderer"
import type { TiptapJSON } from "@/types"

interface TiptapNode {
  type: string
  text?: string
  content?: TiptapNode[]
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
  attrs?: Record<string, unknown>
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 8,
    fontSize: 10,
    lineHeight: 1.5,
  },
  heading1: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 4,
  },
  heading2: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecoration: "underline",
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 10,
  },
  listBullet: {
    width: 15,
  },
  listContent: {
    flex: 1,
  },
})

const renderTextWithMarks = (
  text: string,
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
): React.ReactElement => {
  if (!marks || marks.length === 0) {
    return <Text>{text}</Text>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let textStyle: any = {}
  let isLink = false
  let linkHref = ""

  marks.forEach((mark) => {
    if (mark.type === "bold") {
      textStyle = { ...textStyle, ...styles.bold }
    } else if (mark.type === "italic") {
      textStyle = { ...textStyle, ...styles.italic }
    } else if (mark.type === "underline") {
      textStyle = { ...textStyle, ...styles.underline }
    } else if (mark.type === "link" && mark.attrs?.href) {
      isLink = true
      linkHref = mark.attrs.href as string
      textStyle = { ...textStyle, ...styles.link }
    }
  })

  if (isLink) {
    return (
      <Link src={linkHref} style={textStyle}>
        {text}
      </Link>
    )
  }

  return <Text style={textStyle}>{text}</Text>
}

const renderContent = (content?: TiptapNode[]): React.ReactElement[] => {
  if (!content) return []

  return content.map((node, index) => {
    if (node.type === "text" && node.text) {
      return (
        <React.Fragment key={index}>
          {renderTextWithMarks(node.text, node.marks)}
        </React.Fragment>
      )
    }
    return <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
  })
}

const renderListItem = (
  item: TiptapNode,
  index: number,
  ordered: boolean
): React.ReactElement => {
  const bullet = ordered ? `${index + 1}. ` : "• "

  return (
    <View key={index} style={styles.listItem}>
      <Text style={styles.listBullet}>{bullet}</Text>
      <View style={styles.listContent}>
        {item.content && renderContent(item.content)}
      </View>
    </View>
  )
}

const renderNode = (node: TiptapNode): React.ReactElement | null => {
  switch (node.type) {
    case "paragraph":
      return <Text style={styles.paragraph}>{renderContent(node.content)}</Text>

    case "heading":
      const level = node.attrs?.level || 1
      const headingStyle = level === 1 ? styles.heading1 : styles.heading2
      return <Text style={headingStyle}>{renderContent(node.content)}</Text>

    case "bulletList":
      return (
        <View>
          {node.content?.map((item, index) =>
            renderListItem(item, index, false)
          )}
        </View>
      )

    case "orderedList":
      return (
        <View>
          {node.content?.map((item, index) =>
            renderListItem(item, index, true)
          )}
        </View>
      )

    case "listItem":
      return <View>{renderContent(node.content)}</View>

    case "hardBreak":
      return <Text>{"\n"}</Text>

    default:
      return null
  }
}

export const renderTiptapContent = (
  tiptapJSON: TiptapJSON
): React.ReactElement[] => {
  if (!tiptapJSON || !tiptapJSON.content) {
    return []
  }

  return tiptapJSON.content.map((node, index) => (
    <React.Fragment key={index}>{renderNode(node)}</React.Fragment>
  ))
}
