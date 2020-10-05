/** @jest-environment node */

const compiler = require('./utils/compiler.js')

const fixture = 'fixtures/test.md'

it('Transforms Markdown to JavaScript', async () => {
  const stats = await compiler(fixture)
  const { source: output } =
    stats.toJson().modules.find((module) => module.name.endsWith(fixture)) || {}

  expect(output).toMatchSnapshot()
})

it('Optionally allows inline html', async () => {
  const stats = await compiler(fixture, { allowDangerousHtml: true })
  const { source: output } =
    stats.toJson().modules.find((module) => module.name.endsWith(fixture)) || {}

  expect(output).toMatchSnapshot()
})

it('Accepts additional remark plugins', async () => {
  const remarkPlugins = [require('remark-footnotes')]
  const stats = await compiler(fixture, { remarkPlugins })
  const { source: output } =
    stats.toJson().modules.find((module) => module.name.endsWith(fixture)) || {}

  expect(output).toMatchSnapshot()
})

it('Accepts additional remark plugins with plugin options', async () => {
  const remarkPlugins = [[require('remark-footnotes'), { inlineNotes: true }]]
  const stats = await compiler(fixture, { remarkPlugins })
  const { source: output } =
    stats.toJson().modules.find((module) => module.name.endsWith(fixture)) || {}

  expect(output).toMatchSnapshot()
})

it('Allows importing html and frontmatter', async () => {
  const stats = await compiler(fixture)
  const { source: output } =
    stats.toJson().modules.find((module) => module.name.endsWith(fixture)) || {}

  // esm to commonjs exports
  const { transform } = require('@babel/core')
  const { code } = await transform(output, {
    plugins: [['@babel/plugin-transform-modules-commonjs', { strict: true }]],
  })

  // load module from string
  const Module = require('module')
  const m = new Module()
  m._compile(code, '')
  const { data, default: html } = m.exports

  // render html
  const { createElement } = require('react')
  const renderer = require('react-test-renderer')
  const render = renderer.create(
    createElement('article', { dangerouslySetInnerHTML: html }),
  )

  expect(data).toMatchInlineSnapshot(`
    Object {
      "title": "Test document",
    }
  `)
  expect(render.toJSON()).toMatchInlineSnapshot(`
    <article
      dangerouslySetInnerHTML="<h2>Title</h2>
    <p>Some <strong>important</strong> text![^1] See <a href=\\"https://example.com\\">here</a> for more.^[inline
    note] Please ignore inline html.</p>
    <pre><code class=\\"language-js\\">const message = 'This is a fenced code block.'
    </code></pre>
    <p>[^1]: Well, not so important after all.</p>"
    />
  `)
})
