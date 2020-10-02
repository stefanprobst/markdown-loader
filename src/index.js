const { getOptions } = require('loader-utils')
const { getProcessor } = require('./processor')
const { getTemplate } = require('./template')

module.exports = function loader(source) {
  const callback = this.async()
  const options = getOptions(this)

  const processor = getProcessor(options)
  const template = getTemplate(options)

  processor.process(source).then((result) => {
    callback(null, template(result))
  })
}

module.exports.getProcessor = getProcessor
