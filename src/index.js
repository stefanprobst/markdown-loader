const { getOptions } = require('loader-utils')
const rawHtml = require('rehype-raw')
const sanitize = require('rehype-sanitize')
const toHtml = require('rehype-stringify')
const extract = require('remark-extract-frontmatter')
const frontmatter = require('remark-frontmatter')
const markdown = require('remark-parse')
const toHast = require('remark-rehype')
const unified = require('unified')
const YAML = require('yaml')

module.exports = function loader(source) {
  const callback = this.async()
  const options = getOptions(this)

  const allowDangerousHtml = options.allowDangerousHtml || false

  const processor = unified()
    .use(markdown, { position: false })
    .use(frontmatter)
    .use(extract, { name: 'frontmatter', yaml: YAML.parse })
    .use(toHast, { allowDangerousHtml })

  if (allowDangerousHtml) {
    processor.use(rawHtml)

    if (options.sanitize !== false) {
      processor.use(sanitize, options.sanitationSchema)
    }
  }

  let template

  switch (options.format) {
    case 'html':
    default:
      processor.use(toHtml)
      template = ({ data, contents: html }) =>
        [
          `const data = ${JSON.stringify(data.frontmatter)}`,
          `export { data }`,
          `export default ${JSON.stringify(html)}`,
        ].join('\n')
  }

  if (options.template) {
    template = options.template
  }

  processor.process(source).then((result) => {
    callback(null, template(result))
  })
}
