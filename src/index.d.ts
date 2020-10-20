import { PluggableList, Processor } from 'unified'
import { Schema } from 'hast-util-sanitize'

declare namespace loader {
  type ProcessorOptions = {
    remarkPlugins?: PluggableList
  } & (
    | {
        format?: 'html'
        allowDangerousHtml?: boolean
        sanitize?: boolean
        sanitationSchema?: Schema
      }
    | {
        format: 'plaintext'
      }
  )

  type Template = ({
    data,
    contents,
  }: {
    data: Record<string, unknown>
    contents: unknown
  }) => string

  type PluginOptions = {
    template?: Template
  }

  type Options = ProcessorOptions & PluginOptions

  function getProcessor(options?: ProcessorOptions): Processor
}

declare function loader(options?: loader.Options): void

export = loader
