// Milkdown Crepe WYSIWYG editor, exposed as a self-contained ES module.
// Contract with studio.js: createEditor(root, value, handlers) -> { getValue, setValue, focus, destroy }
import { Crepe } from '@milkdown/crepe'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

export async function createEditor(root, initialValue, handlers = {}) {
  const crepe = new Crepe({
    root,
    defaultValue: initialValue,
    featureConfigs: {
      [Crepe.Feature.ImageBlock]: {
        inlineOnCreate: true,
        onUpload: async (file) => {
          if (handlers.uploadImage) return await handlers.uploadImage(file)
          return URL.createObjectURL(file)
        },
      },
      [Crepe.Feature.Image]: {
        inlineOnCreate: true,
        onUpload: async (file) => {
          if (handlers.uploadImage) return await handlers.uploadImage(file)
          return URL.createObjectURL(file)
        },
      },
    },
  })

  crepe.on((listener) => {
    listener.markdownUpdated((_ctx, markdown, _prev) => {
      handlers.onChange && handlers.onChange(markdown)
    })
  })

  await crepe.create()

  return {
    crepe,
    getValue: () => crepe.getMarkdown(),
    setValue(next) {
      // Recreate is the only reliable way to swap content; caller handles it.
      throw new Error('setValue not supported; recreate editor instead')
    },
    focus: () => {
      root.querySelector('.editor')?.focus()
    },
    destroy: () => crepe.destroy(),
  }
}
