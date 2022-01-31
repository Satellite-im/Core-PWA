import * as markdown from 'simple-markdown'

interface Options {
  escapeHTML?: boolean
  cssModuleNames?: Record<string, string>
}

type MarkdownRules = Record<
  string,
  markdown.ParserRule & markdown.HtmlOutputRule
>

export function htmlTag(
  tagName: string,
  content: string,
  attributes: Record<string, string> | null,
  isClosed: boolean | markdown.State = true,
  state: markdown.State = {},
  mdOpeningSymbol = '',
  mdClosingSymbol?: string,
) {
  if (typeof isClosed === 'object') {
    state = isClosed
    isClosed = true
  }

  if (!attributes) attributes = {}

  if (attributes.class && state.cssModuleNames)
    attributes.class = attributes.class
      .split(' ')
      .map((cl) => state.cssModuleNames[cl] || cl)
      .join(' ')

  let attributeString = ''
  for (const attr in attributes) {
    // Removes falsy attributes
    if (
      Object.prototype.hasOwnProperty.call(attributes, attr) &&
      attributes[attr]
    )
      attributeString += ` ${markdown.sanitizeText(
        attr,
      )}="${markdown.sanitizeText(attributes[attr])}"`
  }

  const openDec: string = mdOpeningSymbol
    ? htmlTag('span', mdOpeningSymbol, { class: 'md-symbol' })
    : ''

  const closeDec: string = mdClosingSymbol
    ? htmlTag('span', mdClosingSymbol, { class: 'md-symbol' })
    : ''

  const unclosedTag = `${openDec}<${tagName}${attributeString}>`

  if (isClosed)
    return (
      unclosedTag +
      content +
      `</${tagName}>${mdClosingSymbol !== undefined ? closeDec : openDec}`
    )
  return unclosedTag
}

const rules: MarkdownRules = {
  em: {
    ...markdown.defaultRules.em,
    parse: (capture, parse, state) => {
      const parsed = markdown.defaultRules.em.parse(capture, parse, state)
      return { ...parsed, symbol: capture[0]?.slice(0, 1) }
    },
    html: (node, output, state) => {
      return htmlTag(
        'em',
        output(node.content, state),
        null,
        state,
        {},
        node.symbol,
      )
    },
  },
  strong: {
    ...markdown.defaultRules.strong,
    parse: (capture, parse, state) => {
      const parsed = markdown.defaultRules.strong.parse(capture, parse, state)
      return { ...parsed, symbol: capture[0]?.slice(0, 2) }
    },
    html: (node, output, state) => {
      return htmlTag(
        'strong',
        output(node.content, state),
        null,
        state,
        {},
        node.symbol,
      )
    },
  },
  u: {
    ...markdown.defaultRules.u,
    parse: (capture, parse, state) => {
      const parsed = markdown.defaultRules.u.parse(capture, parse, state)
      return { ...parsed, symbol: capture[0]?.slice(0, 2) }
    },
    html: (node, output, state) => {
      return htmlTag(
        'u',
        output(node.content, state),
        null,
        state,
        {},
        node.symbol,
      )
    },
  },
  newline: markdown.defaultRules.newline,
  escape: {
    ...markdown.defaultRules.escape,
    parse: (capture) => ({
      content: `${htmlTag('span', '\\', { class: 'md-symbol' })}${capture[1]}`,
    }),
    html: (node) => {
      return node.content
    },
  },
  text: {
    ...markdown.defaultRules.text,
    match: (source) =>
      /^[\s\S]+?(?=[^0-9A-Za-z\s\u00C0-\uFFFF-]|\n\n|\n|\w+:\S|$)/.exec(source),
    html: (node, output, state) => {
      if (state.escapeHTML) return markdown.sanitizeText(node.content)

      return node.content
    },
  },
  inlineCode: {
    ...markdown.defaultRules.inlineCode,
    parse: (capture, parse, state) => {
      const parsed = markdown.defaultRules.inlineCode.parse(
        capture,
        parse,
        state,
      )
      return { ...parsed, symbol: capture.input?.slice(0, 1) }
    },
    html: (node, output, state) => {
      return htmlTag(
        'code',
        markdown.sanitizeText(node.content),
        null,
        state,
        {},
        node.symbol,
      )
    },
  },
  strike: {
    ...markdown.defaultRules.del,
    match: markdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
    parse: (capture, parse, state) => {
      const parsed = markdown.defaultRules.del.parse(capture, parse, state)
      return { ...parsed, symbol: capture[0]?.slice(0, 2) }
    },
    html: (node, output, state) => {
      return htmlTag(
        'del',
        output(node.content, state),
        null,
        state,
        {},
        node.symbol,
      )
    },
  },
  br: {
    ...markdown.defaultRules.br,
    match: markdown.anyScopeRegex(/^\n/),
  },
  autolink: {
    ...markdown.defaultRules.autolink,
    parse: (capture) => {
      return {
        content: [
          {
            type: 'text',
            content: capture[1],
          },
        ],
        target: capture[1],
        symbol: capture[0]?.slice(0, 1),
        closeSymbol: capture[0]?.slice(-1),
      }
    },
    html: (node, output, state) => {
      return htmlTag(
        'span',
        output(node.content, state),
        { class: 'md-url' },
        state,
        {},
        node.symbol,
        node.closeSymbol,
      )
    },
  },
  url: {
    ...markdown.defaultRules.url,
    parse: (capture) => {
      return {
        content: [
          {
            type: 'text',
            content: capture[1],
          },
        ],
        target: capture[1],
      }
    },
    html: (node, output, state) => {
      return htmlTag(
        'span',
        output(node.content, state),
        { class: 'md-url' },
        state,
      )
    },
  },
  spoiler: {
    order: 0,
    match: (source) => /^\|\|([\s\S]+?)\|\|/.exec(source),
    parse: (capture, parse, state) => {
      return {
        content: parse(capture[1], state),
        symbol: capture[0]?.slice(0, 2),
      }
    },
    html: (node, output, state) => {
      return htmlTag(
        'span',
        output(node.content, state),
        null,
        state,
        {},
        node.symbol,
      )
    },
  },
}

const _parser = markdown.parserFor(rules)
const _htmlOutput = markdown.outputFor(rules, 'html')

/**
 * Parse markdown and return the HTML output
 */
export function toHTML(source: string, options: Options = {}) {
  const state = {
    inline: true,
    inQuote: false,
    escapeHTML: options.escapeHTML || true,
    cssModuleNames: options.cssModuleNames || null,
  }

  return _htmlOutput(_parser(source, state), state)
}

export function parser(source: string) {
  return _parser(source, { inline: true })
}
