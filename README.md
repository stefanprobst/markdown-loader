# markdown-loader

Webpack loader for markdown.

## How to use

Add the loader to the webpack configuration:

```js
// webpack.config.js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.md$/
        use: [{
          loader: require.resolve('@stefanprobst/markdown-loader')
          options: {}
        }]
      }
    ]
  }
}
```

The loader makes the generated html available as the default export, and
frontmatter on the `data` named export.

```js
import html, { data } from '@/contents/faq.md'

// Example for rendering in React
export default function FaqPage() {
  return (
    <main>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }}>
    </main>
  )
}
```

## Options

- `allowDangerousHtml`: allow inline html in markdown (default: `false`).
- `sanitize`: when allowing inline html, sanitize unsafe markup (default:
  `true`).
- `sanitationSchema`: whan allowing inline html, sanitize with
  [custom schema](https://github.com/syntax-tree/hast-util-sanitize/blob/main/types/index.d.ts#L9-L66)
  (default:
  [github schema](https://github.com/syntax-tree/hast-util-sanitize/blob/main/lib/github.json))
- `remarkPlugins`: a list of additional remark plugins (or [plugin,
  pluginOptions] tuple), e.g.
  `remarkPlugins: [require('remark-smartypants'), [require('remark-footnotes'), { inlineNotes: true }]]`
