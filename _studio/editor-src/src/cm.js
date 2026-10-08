// CodeMirror 6 markdown source editor, exposed as a self-contained ES module.
// Contract with studio.js: createEditor(root, value, handlers) -> { getValue, setValue, focus, destroy, wrapSelection, toggleLinePrefix, insert }
import { EditorView } from 'codemirror'
import { EditorState, EditorSelection, Prec } from '@codemirror/state'
import { keymap, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'

const studioTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '16px',
    backgroundColor: 'transparent',
  },
  '.cm-scroller': {
    fontFamily: "'SF Mono', 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace",
    lineHeight: '1.7',
    padding: '1.25rem 1.5rem',
    maxWidth: 'calc(45rem + 3rem)',
    margin: '0 auto',
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-content': { caretColor: 'var(--accent, #2563eb)' },
  '.cm-line': { padding: '0' },
})

export function createEditor(root, initialValue, handlers = {}) {
  const onChange = handlers.onChange || (() => {})

  const changeFilter = EditorState.changeFilter.of((tr) => {
    if (tr.docChanged && !applyingExternal) onChange(tr.newDoc.toString())
    return undefined
  })

  let applyingExternal = false

  const saveKeymap = Prec.highest(
    keymap.of([
      {
        key: 'Mod-s',
        preventDefault: true,
        run: () => {
          handlers.onSave && handlers.onSave()
          return true
        },
      },
    ])
  )

  const state = EditorState.create({
    doc: initialValue,
    extensions: [
      saveKeymap,
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      bracketMatching(),
      highlightActiveLine(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.lineWrapping,
      markdown({ codeLanguages: languages, base: markdownLanguage }),
      studioTheme,
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      changeFilter,
    ],
  })

  const view = new EditorView({ state, parent: root })

  return {
    view,
    getValue: () => view.state.doc.toString(),
    getSelection: () => {
      const { from, to } = view.state.selection.main
      return view.state.sliceDoc(from, to)
    },
    setValue(next) {
      applyingExternal = true
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: next } })
      applyingExternal = false
    },
    focus: () => view.focus(),
    destroy: () => view.destroy(),
    insert(text) {
      const { from, to } = view.state.selection.main
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length },
      })
      view.focus()
    },
    wrapSelection(before, after = before, placeholder = 'text') {
      const { from, to } = view.state.selection.main
      const selected = view.state.sliceDoc(from, to)
      const inner = selected || placeholder
      // If the selection is already wrapped, unwrap instead.
      const pre = view.state.sliceDoc(Math.max(0, from - before.length), from)
      const post = view.state.sliceDoc(to, Math.min(view.state.doc.length, to + after.length))
      if (selected && pre === before && post === after) {
        view.dispatch({
          changes: [
            { from: from - before.length, to: from, insert: '' },
            { from: to, to: to + after.length, insert: '' },
          ],
          selection: { anchor: from - before.length, head: to - before.length },
        })
      } else {
        view.dispatch({
          changes: { from, to, insert: before + inner + after },
          selection: { anchor: from + before.length, head: from + before.length + inner.length },
        })
      }
      view.focus()
    },
    toggleLinePrefix(prefix) {
      const range = view.state.selection.main
      const startLine = view.state.doc.lineAt(range.from)
      const endLine = view.state.doc.lineAt(range.to)
      const changes = []
      let allPrefixed = true
      for (let n = startLine.number; n <= endLine.number; n++) {
        const line = view.state.doc.line(n)
        if (!line.text.startsWith(prefix)) allPrefixed = false
      }
      for (let n = startLine.number; n <= endLine.number; n++) {
        const line = view.state.doc.line(n)
        const bare = line.text.startsWith(prefix) ? line.text.slice(prefix.length) : line.text
        changes.push({
          from: line.from,
          to: line.to,
          insert: allPrefixed ? bare : prefix + bare,
        })
      }
      view.dispatch({ changes })
      view.focus()
    },
  }
}
