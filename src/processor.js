const yaml = require('@stefanprobst/remark-extract-yaml-frontmatter')
const rawHtml = require('rehype-raw')
const sanitize = require('rehype-sanitize')
const toHtml = require('rehype-stringify')
const frontmatter = require('remark-frontmatter')
const markdown = require('remark-parse')
const toHast = require('remark-rehype')
const toMarkdown = require('remark-stringify')
const strip = require('strip-markdown')
const unified = require('unified')

function getProcessor(options = {}) {
  const processor = unified()
    .use(markdown, { position: false })
    .use(frontmatter)
    .use(yaml)

  if (Array.isArray(options.remarkPlugins)) {
    processor.use(options.remarkPlugins)
  }

  /** no need to convert to hast */
  switch (options.format) {
    case 'plaintext':
      return processor.use(strip).use(toMarkdown)
  }

  const allowDangerousHtml = options.allowDangerousHtml || false
  processor.use(toHast, { allowDangerousHtml })

  if (allowDangerousHtml) {
    processor.use(rawHtml)

    if (options.sanitize !== false) {
      processor.use(sanitize, options.sanitationSchema)
    }
  }

  switch (options.format) {
    case 'html':
    default:
      return processor.use(toHtml)
  }
}

module.exports = { getProcessor }
