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

    head +=
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css">'
  }

  marked.use(config)
  if (config.mangle) {
    marked.use(require('marked-mangle').mangle())
  }
  if (config.headerIds) {
    marked.use(require('marked-gfm-heading-id').gfmHeadingId(config))
  }
  if (config.admonition) {
    marked.use(require('marked-admonition-extension').default)
  }
  if (config.bidi) {
    marked.use(require('marked-bidi')())
  }
  // TODO: waiting for update to support marked@8
  // if (config.extendedTables) {
  //   marked.use(require('marked-extended-tables')())
  // }
  if (config.katex) {
    marked.use(require('marked-katex-extension')({ throwOnError: false }))
    head +=
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css">'
  }

  return context => {
    context.path = context.path.replace(/\.[^\.]+$/, '.html')
    context.head = (context.head ?? '') + head
    context.content = marked.parse(context.content.toString())
  }
}
