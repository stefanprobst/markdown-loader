function getTemplate(options = {}) {
  if (options.template) {
    return options.template
  }

  switch (options.format) {
    case 'html':
    default:
      return ({ data, contents: html }) =>
        [
          `const data = ${JSON.stringify(data.frontmatter)}`,
          `export { data }`,
          `export default ${JSON.stringify(html)}`,
        ].join('\n')
  }
}

module.exports = { getTemplate }
