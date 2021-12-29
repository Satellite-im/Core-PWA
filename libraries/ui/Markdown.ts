import highlight from 'highlight.js'
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
  for (let attr in attributes) {
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

  let unclosedTag = `${openDec}<${tagName}${attributeString}>`

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
      /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff-]|\n\n|\n|\w+:\S|$)/.exec(source),
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
  // blockQuote: {
  //   ...markdown.defaultRules.blockQuote,
  //   match: function (source, state, prevSource) {
  //     return !/^$|\n *$/.test(prevSource) || state.inQuote
  //       ? null
  //       : /^( *>>> ([\s\S]*))|^( *> [^\n]*(\n *> [^\n]*)*\n?)/.exec(source)
  //   },
  //   parse: function (capture, parse, state) {
  //     const all = capture[0]
  //     const isBlock = Boolean(/^ *>>> ?/.exec(all))
  //     const removeSyntaxRegex = isBlock ? /^ *>>> ?/ : /^ *> ?/gm
  //     const content = all.replace(removeSyntaxRegex, '')

  //     return {
  //       content: parse(content, { ...state, inQuote: true }),
  //       type: 'blockQuote',
  //     }
  //   },
  // },
  // codeBlock: {
  //   ...markdown.defaultRules.codeBlock,
  //   match: markdown.inlineRegex(/^```(([a-z0-9-]+?)\n+)?\n*([^]*?)\n*(```|$)/i),
  //   parse: function (capture, parse, state) {
  //     console.log(capture)
  //     return {
  //       lang: (capture[2] || '').trim(),
  //       content: capture[3] || '',
  //       inQuote: state.inQuote || false,
  //       symbol: capture.input?.slice(0, 3),
  //       closeSymbol:
  //         capture.input?.slice(-3) === '```' && capture.input.length !== 3
  //           ? '```'
  //           : '',
  //     }
  //   },
  //   html: (node, output, state) => {
  //     let code
  //     if (node.lang && highlight.getLanguage(node.lang))
  //       code = highlight.highlight(node.content, {
  //         language: node.lang,
  //         ignoreIllegals: true,
  //       })

  //     // if (code && state.cssModuleNames)
  //     //   // Replace classes in hljs output
  //     //   code.value = code.value.replace(
  //     //     /<span class="([a-z0-9-_ ]+)">/gi,
  //     //     (str: string, m: string) =>
  //     //       str.replace(
  //     //         m,
  //     //         m
  //     //           .split(' ')
  //     //           .map((cl) => state.cssModuleNames[cl] || cl)
  //     //           .join(' '),
  //     //       ),
  //     //   )

  //     console.log('code', code, node)
  //     return htmlTag(
  //       'span',
  //       code ? code.value : markdown.sanitizeText(node.content),
  //       // htmlTag(
  //       //   'span',
  //       //   code ? code.value : markdown.sanitizeText(node.content),
  //       //   { class: `hljs${code ? ' ' + code.language : ''}` },
  //       //   state,
  //       // ),
  //       null,
  //       state,
  //       {},
  //       node.symbol,
  //       node.closeSymbol,
  //     )
  //   },
  // },
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
