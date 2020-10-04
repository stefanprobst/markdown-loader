const extract = require('@stefanprobst/remark-extract-yaml-frontmatter')
const rawHtml = require('rehype-raw')
const sanitize = require('rehype-sanitize')
const toHtml = require('rehype-stringify')
const frontmatter = require('remark-frontmatter')
const markdown = require('remark-parse')
const toHast = require('remark-rehype')
const unified = require('unified')

function getProcessor(options = {}) {
  const allowDangerousHtml = options.allowDangerousHtml || false

  const processor = unified()
    .use(markdown, { position: false })
    .use(frontmatter)
    .use(extract)
    .use(toHast, { allowDangerousHtml })

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
