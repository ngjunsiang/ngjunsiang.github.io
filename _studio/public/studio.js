/* Drafting studio front-end. Vanilla JS, no framework. */

const $ = (sel) => document.querySelector(sel)

const state = {
  root: null,
  siteTitle: '',
  jekyllPort: 4000,
  ghAvailable: true,
  branch: '',
  dirty: new Set(),
  posts: { drafts: [], posts: [] },
  allTags: [],
  // current post
  path: null,        // "drafts/foo.md" | "posts/2026-01-01-foo.md"
  fields: null,      // { title, tags: [], date, description, permalink, layout }
  body: '',
  published: false,
  editor: null,      // adapter: { getValue, setValue, getSelection?, focus, destroy, insert?, wrapSelection?, toggleLinePrefix? }
  editorMode: 'wysiwyg',
  view: 'split',
  editorKind: null,  // 'milkdown' | 'codemirror' | 'textarea'
  saveTimer: null,
  previewTimer: null,
  previewStatus: null,
}

/* ---------------------------------------------------------------- api */

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  let data = {}
  try { data = await res.json() } catch { /* empty body */ }
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`)
  return data
}

/* ---------------------------------------------------------------- toast */

let toastTimer
function toast(msg, isError = false) {
  const el = $('#toast')
  el.textContent = msg
  el.classList.toggle('error', isError)
  el.hidden = false
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { el.hidden = true }, isError ? 6000 : 2600)
}

/* ---------------------------------------------------------------- boot */

async function boot() {
  await refreshState()
  await refreshPosts()
  wireChrome()
  window.addEventListener('hashchange', route)
  route()
  setInterval(pollState, 8000)
}

async function refreshState() {
  try {
    const s = await api('/api/state')
    state.root = s.root
    state.siteTitle = s.site_title || ''
    state.jekyllPort = s.jekyll_port
    state.ghAvailable = s.gh_available !== false
    state.branch = s.branch || ''
    state.dirty = new Set(s.dirty || [])
    state.jekyllUp = s.jekyll === 'up'
    renderChrome()
  } catch (e) {
    toast(`server unreachable: ${e.message}`, true)
  }
}

async function refreshPosts() {
  const p = await api('/api/posts')
  state.posts = p
  state.allTags = [...new Set([...p.drafts, ...p.posts].flatMap((x) => x.tags || []))].sort()
  renderSidebar()
  renderTagSuggestions()
}

function pollState() {
  refreshState()
}

function renderChrome() {
  $('#site-title').textContent = state.siteTitle
  const jpill = $('#jekyll-status')
  jpill.classList.toggle('up', state.jekyllUp === true)
  jpill.classList.toggle('down', state.jekyllUp !== true)
  jpill.title = state.jekyllUp ? `jekyll serve on :${state.jekyllPort}` : 'jekyll serve not responding — run bin/draft'
  $('#branch-chip').textContent = state.branch || 'no git'
  $('#view-site').href = `http://127.0.0.1:${state.jekyllPort}/`
}

/* ---------------------------------------------------------------- sidebar */

function renderSidebar() {
  const nav = $('#post-list')
  nav.innerHTML = ''
  const section = (label, items, kind) => {
    const h = document.createElement('div')
    h.className = 'list-label'
    h.textContent = `${label} (${items.length})`
    nav.appendChild(h)
    for (const p of items) {
      const a = document.createElement('a')
      a.className = 'item' + (state.path === `${kind}/${p.name}` ? ' active' : '')
      a.href = `#/${kind}/${encodeURIComponent(p.name)}`
      const sub = [p.date, p.permalink, (p.tags || []).join(', ')].filter(Boolean).join(' · ')
      a.innerHTML = `<span class="item-title"></span><span class="item-sub"></span>`
      a.querySelector('.item-title').textContent = p.title || p.name
      a.querySelector('.item-sub').textContent = sub
      if (kind === 'drafts') {
        const del = document.createElement('button')
        del.className = 'del'
        del.title = 'delete draft'
        del.textContent = '✕'
        del.addEventListener('click', async (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!confirm(`Delete draft ${p.name}? This cannot be undone.`)) return
          try {
            await api(`/api/post?path=${encodeURIComponent(`drafts/${p.name}`)}`, { method: 'DELETE' })
            toast('draft deleted')
            if (state.path === `drafts/${p.name}`) location.hash = '#/'
            await refreshPosts()
          } catch (err) { toast(err.message, true) }
        })
        a.appendChild(del)
      }
      nav.appendChild(a)
    }
  }
  section('Drafts', state.posts.drafts, 'drafts')
  section('Published', state.posts.posts, 'posts')
}

function renderTagSuggestions() {
  const dl = $('#tag-suggestions')
  dl.innerHTML = ''
  for (const t of state.allTags) {
    const o = document.createElement('option')
    o.value = t
    dl.appendChild(o)
  }
}

/* ---------------------------------------------------------------- router */

async function route() {
  const h = location.hash.replace(/^#\/?/, '')
  const [kind, ...rest] = h.split('/')
  const name = decodeURIComponent(rest.join('/'))
  if ((kind === 'drafts' || kind === 'posts') && name) {
    await openPost(`${kind}/${name}`)
  } else {
    await closePost()
    showDashboard()
  }
}

async function openPost(path) {
  try {
    if (state.dirtyMarked) await save()
    const p = await api(`/api/post?path=${encodeURIComponent(path)}`)
    state.path = path
    state.published = path.startsWith('posts/')
    state.fields = {
      title: p.title,
      tags: p.tags || [],
      date: p.date,
      description: p.description,
      permalink: p.permalink,
      layout: p.layout || 'post',
    }
    state.body = p.body
    renderMetaCard()
    $('#dashboard').hidden = true
    $('#editor-page').hidden = false
    updatePreviewUrl(true)
    await mountEditor(state.body)
    renderSidebar()
    pollPreviewStatus()
  } catch (e) {
    toast(e.message, true)
    location.hash = '#/'
  }
}

async function closePost() {
  if (state.dirtyMarked) await save()
  destroyEditor()
  state.path = null
}

function showDashboard() {
  $('#editor-page').hidden = true
  $('#dashboard').hidden = false
}

/* ---------------------------------------------------------------- meta card */

function renderMetaCard() {
  $('#f-title').value = state.fields.title
  $('#f-date').value = state.fields.date
  $('#f-permalink').value = state.fields.permalink
  $('#f-tags').value = state.fields.tags.join(', ')
  $('#f-description').value = state.fields.description
  $('#f-file').textContent = `${state.root}/${state.path.startsWith('posts/') ? '_posts' : '_drafts'}/${state.path.split('/')[1]}`
  $('#btn-move-to-posts').disabled = state.published
  $('#btn-move-to-posts').textContent = state.published ? 'Already in _posts' : 'Move draft → _posts'
  $('#pub-draft-section').hidden = state.published
}

function readMetaCard() {
  state.fields = {
    title: $('#f-title').value,
    date: $('#f-date').value,
    permalink: $('#f-permalink').value.trim(),
    tags: $('#f-tags').value.split(',').map((s) => s.trim()).filter(Boolean),
    description: $('#f-description').value,
    layout: state.fields.layout,
  }
}

function wireMetaCard() {
  const dirty = () => { readMetaCard(); markDirty(); scheduleSave() }
  for (const sel of ['#f-title', '#f-date', '#f-permalink', '#f-tags', '#f-description']) {
    $(sel).addEventListener('input', dirty)
  }
  $('#btn-meta-toggle').addEventListener('click', () => {
    const f = $('#meta-fields')
    f.hidden = !f.hidden
    $('#btn-meta-toggle').textContent = f.hidden ? 'Details ▾' : 'Details ▴'
  })
}

/* ---------------------------------------------------------------- editor adapters */

function destroyEditor() {
  if (state.editor) {
    try { state.editor.destroy() } catch { /* already gone */ }
  }
  state.editor = null
  $('#editor-host').innerHTML = ''
  state.editorKind = null
}

// Milkdown serializes bullet lists with '*'; the blog's convention is '-'.
// Normalize outside code fences so reopened posts don't produce noisy diffs.
function normalizeBullets(md) {
  let inFence = false
  return md
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence
        return line
      }
      return !inFence && /^\* /.test(line) ? '- ' + line.slice(2) : line
    })
    .join('\n')
}

async function mountEditor(value) {
  destroyEditor()
  const host = $('#editor-host')
  const handlers = {
    onChange: (v) => { state.body = v; markDirty(); scheduleSave() },
    onSave: () => save(),
    uploadImage: uploadImageFile,
  }
  if (state.editorMode === 'wysiwyg') {
    try {
      const mod = await import('./bundles/milkdown.js')
      const host2 = document.createElement('div')
      host2.className = 'milkdown-host'
      host.appendChild(host2)
      state.editor = await mod.createEditor(host2, value, {
        ...handlers,
        onChange: (v) => handlers.onChange(normalizeBullets(v)),
      })
      const getValue = state.editor.getValue
      state.editor.getValue = () => normalizeBullets(getValue.call(state.editor))
      state.editorKind = 'milkdown'
    } catch (e) {
      console.warn('milkdown failed, falling back to source editor', e)
      toast('WYSIWYG editor unavailable — using source editor', true)
      state.editorMode = 'source'
      syncToolbarUI()
      return mountEditor(value)
    }
  } else {
    try {
      const mod = await import('./bundles/cm.js')
      state.editor = mod.createEditor(host, value, handlers)
      state.editorKind = 'codemirror'
    } catch (e) {
      console.warn('codemirror failed, falling back to textarea', e)
      state.editor = createTextareaEditor(host, value, handlers)
      state.editorKind = 'textarea'
    }
  }
  updateFooter()
}

function createTextareaEditor(host, value, handlers) {
  const ta = document.createElement('textarea')
  ta.className = 'plain-editor'
  ta.value = value
  ta.spellcheck = false
  host.appendChild(ta)
  ta.addEventListener('input', () => handlers.onChange(ta.value))
  ta.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); handlers.onSave() }
  })
  const sel = () => [ta.selectionStart, ta.selectionEnd]
  return {
    getValue: () => ta.value,
    getSelection: () => ta.value.slice(...sel()),
    setValue: (v) => { ta.value = v },
    focus: () => ta.focus(),
    destroy: () => ta.remove(),
    insert(text) {
      const [a, b] = sel()
      ta.setRangeText(text, a, b, 'end')
      handlers.onChange(ta.value)
      ta.focus()
    },
    wrapSelection(before, after, placeholder = 'text') {
      const [a, b] = sel()
      const inner = ta.value.slice(a, b) || placeholder
      ta.setRangeText(before + inner + after, a, b, 'select')
      if (!ta.value.slice(a, b)) ta.setSelectionRange(a + before.length, a + before.length + placeholder.length)
      handlers.onChange(ta.value)
      ta.focus()
    },
    toggleLinePrefix(prefix) {
      const v = ta.value
      const start = v.lastIndexOf('\n', ta.selectionStart - 1) + 1
      let end = v.indexOf('\n', ta.selectionEnd)
      if (end === -1) end = v.length
      const lines = v.slice(start, end).split('\n')
      const all = lines.every((l) => l.startsWith(prefix))
      const next = lines.map((l) => (all ? l.slice(prefix.length) : prefix + l)).join('\n')
      ta.setRangeText(next, start, end, 'end')
      handlers.onChange(ta.value)
      ta.focus()
    },
  }
}

/* ---------------------------------------------------------------- toolbar */

function syncToolbarUI() {
  document.querySelectorAll('#view-switch .tb-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === state.view))
  document.querySelectorAll('#mode-switch .tb-btn').forEach((b) =>
    b.classList.toggle('active', b.dataset.mode === state.editorMode))
  $('#format-tools').style.display = state.editorMode === 'source' ? '' : 'none'
  $('#panes').dataset.view = state.view
}

function wireToolbar() {
  document.querySelectorAll('#view-switch .tb-btn').forEach((b) =>
    b.addEventListener('click', () => {
      state.view = b.dataset.view
      syncToolbarUI()
      updatePreviewUrl(true)
      pollPreviewStatus()
    }))
  document.querySelectorAll('#mode-switch .tb-btn').forEach((b) =>
    b.addEventListener('click', () => setMode(b.dataset.mode)))

  const actions = {
    bold: () => state.editor.wrapSelection('**', '**', 'bold text'),
    italic: () => state.editor.wrapSelection('*', '*', 'italic text'),
    code: () => state.editor.wrapSelection('`', '`', 'code'),
    h2: () => state.editor.toggleLinePrefix('## '),
    h3: () => state.editor.toggleLinePrefix('### '),
    quote: () => state.editor.toggleLinePrefix('> '),
    ul: () => state.editor.toggleLinePrefix('- '),
    link: linkAction,
    image: () => $('#image-input').click(),
  }
  document.querySelectorAll('#format-tools .tb-btn').forEach((b) =>
    b.addEventListener('click', () => {
      const act = actions[b.dataset.act]
      if (act && state.editor) act()
    }))
}

function linkAction() {
  const sel = (state.editor.getSelection && state.editor.getSelection()) || ''
  const url = prompt('Link URL:', 'https://')
  if (!url) return
  if (sel) state.editor.wrapSelection('[', `](${url})`)
  else state.editor.insert(`[link](${url})`)
}

async function setMode(mode) {
  if (!state.path || mode === state.editorMode) return
  await save()
  state.editorMode = mode
  syncToolbarUI()
  await mountEditor(state.body)
}

/* ---------------------------------------------------------------- save */

function markDirty() {
  state.dirtyMarked = true
  const el = $('#save-status')
  el.textContent = 'unsaved changes'
  el.className = 'save-status dirty'
}

function scheduleSave() {
  clearTimeout(state.saveTimer)
  state.saveTimer = setTimeout(() => save(), 1200)
}

async function save() {
  clearTimeout(state.saveTimer)
  if (!state.path) return
  const status = $('#save-status')
  if (state.editor) state.body = state.editor.getValue()
  status.textContent = 'saving…'
  status.className = 'save-status'
  try {
    await api('/api/save', {
      method: 'POST',
      body: JSON.stringify({
        path: state.path,
        fields: {
          title: state.fields.title,
          tags: state.fields.tags,
          layout: state.fields.layout || 'post',
          date: state.fields.date,
          description: state.fields.description,
          permalink: state.fields.permalink,
        },
        body: state.body,
      }),
    })
    state.dirtyMarked = false
    status.textContent = `saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
    status.className = 'save-status'
    updateFooter()
    refreshPosts()
    pollPreviewStatus()
  } catch (e) {
    status.textContent = 'save failed'
    status.className = 'save-status error'
    toast(e.message, true)
  }
}

function updateFooter() {
  $('#footer-path').textContent = state.path ? `${state.root}/${state.path.startsWith('posts/') ? '_posts' : '_drafts'}/${state.path.split('/')[1]}` : ''
  $('#footer-state').textContent = state.editorKind ? `editor: ${state.editorKind}` : ''
}

/* ---------------------------------------------------------------- preview */

function previewUrl() {
  if (!state.fields || !state.fields.permalink) return null
  return location.origin + '/' + state.fields.permalink
}

function updatePreviewUrl(force = false) {
  const url = previewUrl()
  const frame = $('#preview-frame')
  if (!url) return
  if (force || frame.src !== url) frame.src = url
}

async function pollPreviewStatus() {
  if (!state.path) return
  const url = previewUrl()
  const overlay = $('#preview-overlay')
  const msg = $('#preview-overlay-msg')
  if (!url) {
    if (state.view !== 'write') {
      overlay.hidden = false
      msg.textContent = 'This post has no permalink. Add one under Details to enable preview.'
    }
    return
  }
  if (state.view === 'write') { overlay.hidden = true; return }
  try {
    const r = await api(`/api/preview?path=${encodeURIComponent('/' + state.fields.permalink)}`)
    state.previewStatus = r.status
    state.jekyllUp = r.status !== 'down'
    renderChrome()
    if (r.status === 200) {
      overlay.hidden = true
    } else if (r.status === 'down') {
      overlay.hidden = false
      msg.textContent = 'jekyll serve is not responding yet — it starts automatically with bin/draft and can take a few seconds.'
    } else {
      overlay.hidden = false
      msg.textContent = `jekyll returned ${r.status}. If this is a new draft, wait for the rebuild (a second), then retry.`
    }
  } catch {
    state.jekyllUp = false
    renderChrome()
  }
}

/* ---------------------------------------------------------------- images */

async function fileToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

async function processImageFile(file) {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image`)
  const MAXSIDE = 1600
  const MAXBYTES = 800 * 1024
  let blob = file
  let name = file.name
  try {
    const bmp = await createImageBitmap(file)
    if (Math.max(bmp.width, bmp.height) > MAXSIDE || file.size > MAXBYTES) {
      const scale = Math.min(MAXSIDE / Math.max(bmp.width, bmp.height), 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(bmp.width * scale)
      canvas.height = Math.round(bmp.height * scale)
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height)
      const type = file.type === 'image/jpeg' ? 'image/jpeg' : file.type === 'image/webp' ? 'image/webp' : 'image/png'
      blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.85))
      if (blob && blob.size < file.size) {
        name = name.replace(/\.[^.]*$/, '') + { 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/png': '.png' }[type]
      } else {
        blob = file
      }
    }
    bmp.close?.()
  } catch { /* createImageBitmap unsupported — upload original */ }
  return { name, data: await fileToBase64(blob) }
}

async function uploadImageFile(file) {
  const { name, data } = await processImageFile(file)
  const date = state.fields?.date || new Date().toISOString().slice(0, 10)
  const r = await api('/api/image', { method: 'POST', body: JSON.stringify({ name, data, date }) })
  toast(`uploaded ${r.url} (${Math.round(r.bytes / 1024)} KB)`)
  return r.url
}

async function onPickImage() {
  const input = $('#image-input')
  const file = input.files[0]
  input.value = ''
  if (!file || !state.editor) return
  try {
    const url = await uploadImageFile(file)
    const alt = file.name.replace(/\.[^.]*$/, '').replace(/[-_]+/g, ' ')
    if (state.editorKind === 'milkdown') {
      toast('Image uploaded — insert it with the image block (type "!")')
    } else {
      state.editor.insert(`\n![${alt}](${url})\n`)
    }
  } catch (e) { toast(e.message, true) }
}

function wireImageDrop() {
  const host = $('#editor-host')
  $('#image-input').addEventListener('change', onPickImage)
  // Milkdown handles its own paste/drop uploads via its image block feature;
  // intercept only for the source editors.
  const active = () => state.editor && state.editorKind !== 'milkdown'
  host.addEventListener('paste', (e) => {
    if (!active()) return
    const file = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'))?.getAsFile()
    if (!file) return
    e.preventDefault()
    uploadImageFile(file)
      .then((url) => state.editor.insert(`\n![image](${url})\n`))
      .catch((err) => toast(err.message, true))
  })
  host.addEventListener('drop', (e) => {
    if (!active()) return
    const file = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith('image/'))
    if (!file) return
    e.preventDefault()
    uploadImageFile(file)
      .then((url) => state.editor.insert(`\n![${file.name.replace(/\.[^.]*$/, '')}](${url})\n`))
      .catch((err) => toast(err.message, true))
  })
}

/* ---------------------------------------------------------------- new draft dialog */

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-')
}

function wireNewDraft() {
  const dlg = $('#new-draft-dialog')
  const ndTitle = $('#nd-title')
  const ndSlug = $('#nd-slug')
  const ndPermalink = $('#nd-permalink')
  let slugTouched = false
  let permalinkTouched = false

  $('#btn-new').addEventListener('click', () => {
    ndTitle.value = ''
    ndSlug.value = ''
    ndPermalink.value = ''
    $('#nd-tags').value = ''
    $('#nd-description').value = ''
    $('#nd-date').value = new Date().toISOString().slice(0, 10)
    $('#nd-error').textContent = ''
    slugTouched = permalinkTouched = false
    dlg.showModal()
    ndTitle.focus()
  })
  $('#nd-cancel').addEventListener('click', () => dlg.close())
  ndTitle.addEventListener('input', () => {
    if (!slugTouched) ndSlug.value = slugify(ndTitle.value)
    if (!permalinkTouched) ndPermalink.value = ndSlug.value
  })
  ndSlug.addEventListener('input', () => {
    slugTouched = true
    if (!permalinkTouched) ndPermalink.value = ndSlug.value
  })
  ndPermalink.addEventListener('input', () => { permalinkTouched = true })

  $('#new-draft-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const err = $('#nd-error')
    err.textContent = ''
    try {
      const r = await api('/api/create', {
        method: 'POST',
        body: JSON.stringify({
          title: ndTitle.value,
          slug: ndSlug.value,
          date: $('#nd-date').value,
          tags: $('#nd-tags').value.split(',').map((s) => s.trim()).filter(Boolean),
          description: $('#nd-description').value,
          permalink: ndPermalink.value,
        }),
      })
      dlg.close()
      await refreshPosts()
      location.hash = `#/${r.path}`
    } catch (ex) {
      err.textContent = ex.message
    }
  })
}

/* ---------------------------------------------------------------- publish drawer */

function log(line) {
  const el = $('#pub-log')
  el.textContent += (el.textContent ? '\n' : '') + line
  el.scrollTop = el.scrollHeight
}

async function runGitAction(label, path, body) {
  log(`$ ${label}`)
  try {
    const r = await api(path, { method: 'POST', body: JSON.stringify(body || {}) })
    if (r.out) log(r.out.trim())
    log('  ✓ ok')
    await refreshState()
    return r
  } catch (e) {
    log(`  ✗ ${e.message}`)
    toast(e.message, true)
    return null
  }
}

function currentFilesystemPath() {
  if (!state.path) return null
  return `_${state.path.replace('/', '/')}` // drafts/x.md -> _drafts/x.md
}

function referencedImages() {
  const urls = [...new Set([...state.body.matchAll(/images\/[A-Za-z0-9._/-]+\s*\)/g)].map((m) => m[0].replace(/\s*\)$/, '')))]
  return urls
}

async function refreshDrawer() {
  if (state.dirtyMarked) await save()
  const s = await api('/api/git/status')
  $('#pub-branch').innerHTML = `branch: <b></b>`
  $('#pub-branch').querySelector('b').textContent = s.branch
  const dirty = s.dirty || []
  $('#pub-dirty').textContent = dirty.length ? dirty.join('\n') : 'working tree clean'
  $('#pub-msg').value = $('#pub-msg').value || suggestCommitMessage()
  $('#pub-branch-name').value = $('#pub-branch-name').value || suggestBranchName()
  $('#btn-pr').disabled = !state.ghAvailable
  $('#btn-pr').title = state.ghAvailable ? '' : 'gh CLI not available'
}

function suggestCommitMessage() {
  if (!state.path) return ''
  const slug = state.path.split('/')[1].replace(/\.(md|markdown)$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
  return `add: ${slug}`
}

function suggestBranchName() {
  const slug = state.path ? state.path.split('/')[1].replace(/\.(md|markdown)$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '') : 'post'
  return `draft/${slug}`
}

function wirePublishDrawer() {
  const drawer = $('#publish-drawer')
  $('#btn-publish').addEventListener('click', () => {
    drawer.hidden = !drawer.hidden
    if (!drawer.hidden) refreshDrawer()
  })
  $('#btn-drawer-close').addEventListener('click', () => { drawer.hidden = true })

  $('#btn-move-to-posts').addEventListener('click', async () => {
    if (!state.path || state.published) return
    if (state.dirtyMarked) await save()
    const r = await runGitAction(`publish ${state.path}`, '/api/publish', { path: state.path })
    if (r) {
      toast(`published to _posts/${r.path.split('/')[1]}`)
      await refreshPosts()
      location.hash = `#/${r.path}`
    }
  })

  $('#btn-create-branch').addEventListener('click', () => {
    const name = $('#pub-branch-name').value.trim()
    if (name) runGitAction(`checkout -b ${name}`, '/api/git/branch', { name, create: true })
  })

  $('#btn-commit').addEventListener('click', async () => {
    const msg = $('#pub-msg').value.trim()
    if (!msg) { toast('commit message required', true); return }
    const paths = $('#pub-stage-all').checked
      ? null
      : [currentFilesystemPath(), ...referencedImages()].filter(Boolean)
    if (paths) {
      await runGitAction(`add ${paths.join(' ')}`, '/api/git/stage', { paths })
    } else {
      await runGitAction('add -A', '/api/git/stage', { paths: ['_drafts', '_posts', 'images'] })
    }
    await runGitAction(`commit -m "${msg}"`, '/api/git/commit', { message: msg })
  })

  $('#btn-push').addEventListener('click', async () => {
    const branch = state.branch
    if (!branch || branch === 'main') { toast('create a branch first', true); return }
    await runGitAction(`push -u origin ${branch}`, '/api/git/push', { name: branch })
  })

  $('#btn-pr').addEventListener('click', async () => {
    await runGitAction('gh pr create', '/api/pr', { title: $('#pub-msg').value.trim() || suggestCommitMessage(), body: '' })
  })
}

/* ---------------------------------------------------------------- scroll sync */

// Fractional two-way sync: editor scroll position maps to the same fraction of
// the preview document and vice versa. The lock suppresses the echo of our own
// programmatic scroll on the other pane.
let scrollLockUntil = 0

function editorScrollEl() {
  if (!state.editor) return null
  if (state.editorKind === 'codemirror') return $('#editor-host .cm-scroller')
  if (state.editorKind === 'textarea') return $('#editor-host textarea.plain-editor')
  return $('#editor-host .milkdown-host')
}

function scrollFraction(el) {
  const max = el.scrollHeight - el.clientHeight
  return max > 0 ? el.scrollTop / max : 0
}

function applyScrollFraction(el, frac) {
  el.scrollTop = frac * (el.scrollHeight - el.clientHeight)
}

function syncScroll(from) {
  if (state.view !== 'split') return
  if (Date.now() < scrollLockUntil) return
  const frame = $('#preview-frame')
  const doc = frame.contentDocument && frame.contentDocument.scrollingElement
  if (from === 'editor') {
    const ed = editorScrollEl()
    if (!ed || !doc) return
    scrollLockUntil = Date.now() + 80
    applyScrollFraction(doc, scrollFraction(ed))
  } else {
    const ed = editorScrollEl()
    if (!ed || !doc) return
    scrollLockUntil = Date.now() + 80
    applyScrollFraction(ed, scrollFraction(doc))
  }
}

function syncFromEditor() { syncScroll('editor') }

function wireScrollSync() {
  // scroll events don't bubble, so listen in capture phase on the host
  $('#editor-host').addEventListener('scroll', () => syncScroll('editor'), true)
  const frame = $('#preview-frame')
  frame.addEventListener('load', () => {
    try {
      const doc = frame.contentDocument
      if (!doc) return
      doc.addEventListener('scroll', () => syncScroll('preview'), true)
      // follow the editor once a (re)loaded page settles
      setTimeout(syncFromEditor, 60)
    } catch { /* not same-origin (unexpected) — sync unavailable */ }
  })
}

/* ---------------------------------------------------------------- chrome wiring */

function wireChrome() {
  wireMetaCard()
  wireToolbar()
  wireNewDraft()
  wirePublishDrawer()
  wireImageDrop()
  wireScrollSync()

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      save()
    }
  })
  window.addEventListener('beforeunload', (e) => {
    if (state.dirtyMarked) { e.preventDefault(); e.returnValue = '' }
  })
  $('#btn-preview-retry').addEventListener('click', () => {
    updatePreviewUrl(true)
    pollPreviewStatus()
  })
  setInterval(pollPreviewStatus, 4000)
}

boot()
