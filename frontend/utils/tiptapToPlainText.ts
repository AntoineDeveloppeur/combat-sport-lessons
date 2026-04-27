import type { TiptapJSON } from '@/types'

export function tiptapToPlainText(tiptapJSON: TiptapJSON): string {
  if (!tiptapJSON || !tiptapJSON.content) {
    return ''
  }

  const extractText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('')
    }

    return ''
  }

  return tiptapJSON.content
    .map((node) => {
      const text = extractText(node)
      
      // Ajouter des sauts de ligne pour les blocs
      if (node.type === 'paragraph' || node.type === 'heading') {
        return text + '\n'
      }
      
      // Pour les listes, ajouter des puces ou numéros
      if (node.type === 'bulletList' && node.content) {
        return node.content.map((item: any) => '• ' + extractText(item)).join('\n') + '\n'
      }
      
      if (node.type === 'orderedList' && node.content) {
        return node.content.map((item: any, index: number) => `${index + 1}. ${extractText(item)}`).join('\n') + '\n'
      }
      
      return text
    })
    .join('')
    .trim()
}
