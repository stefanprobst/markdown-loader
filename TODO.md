# TODO

## performance parsing inline html

compare performance of `rehype-raw` to using a handler for `html` nodes when
transforming mdast to hast:

```js
.use(toHast, {
  allowDangerousHtml,
  handlers: {
      html(h, node) {
        return unified()
          .use(require('rehype-parse'), { fragment: true })
          .parse(node.value)
          .children
      }
  }
```

## micromark

try our micromark
