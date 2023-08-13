const marked = require('marked')

module.exports = config => {
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
    config.katex.throwOnError = config.katex.throwOnError ?? false
    marked.use(require('marked-katex-extension')(config.katex))
  }

  return ctx => {
    ctx.type = 'html'
    ctx.content = marked.parse(ctx.content.toString())
  }
}
