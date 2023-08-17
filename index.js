const marked = require('marked')

module.exports = config => {
  let head = ''

  if (config.highlight) {
    marked.use(
      require('marked-highlight').markedHighlight({
        langPrefix: 'hljs language-',
        highlight (code, lang) {
          const hljs = require('highlight.js')
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        }
      })
    )

    // since marked@5.0.0, highlight was deprecated defaultly
    // delete 'config.highlight' to prevent confounding
    delete config.highlight
    head +=
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css">'
  }

  marked.use(config)
  // since marked@5.0.0, 'mangle' and 'headerIds' are enabled defaultly but need extensions
  if (config.mangle != false) {
    marked.use(require('marked-mangle').mangle())
  }
  if (config.headerIds != false) {
    marked.use(require('marked-gfm-heading-id').gfmHeadingId(config))
  }
  if (config.admonition) {
    marked.use(require('marked-admonition-extension').default)
  }
  if (config.bidi) {
    marked.use(require('marked-bidi')())
  }
  if (config.extendedTables) {
    marked.use(require('marked-extended-tables')())
  }
  if (config.katex) {
    marked.use(require('marked-katex-extension')({ throwOnError: false }))
    head +=
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css">'
  }

  return context => {
    context.path = context.path.replace(/\.[^\.]+$/, '.html')
    context.head += head
    context.content = marked.parse(context.content.toString())
  }
}
