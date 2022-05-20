import { htmlTag, toHTML } from './Markdown'
const assert = require('assert').strict

const htmlFromMarkdown = function (source: string) {
  const html = toHTML(source)
  const simplifiedHtml = html.replace(/\s+/g, ' ')
  return simplifiedHtml
}

const assertParsesToHtml = function (source: string, html: string) {
  const actualHtml = htmlFromMarkdown(source)
  assert.strictEqual(actualHtml, html)
}

const decorator = function (mdSymbol: string) {
  return htmlTag('span', mdSymbol, { class: 'md-symbol' })
}

describe('html output', function () {
  it('should output em with *', function () {
    assertParsesToHtml(
      '*italics*',
      `${decorator('*')}<em>italics</em>${decorator('*')}`,
    )
  })

  it('should output em with _', function () {
    assertParsesToHtml(
      '_italics_',
      `${decorator('_')}<em>italics</em>${decorator('_')}`,
    )
  })

  it('should output strong', function () {
    assertParsesToHtml(
      '**bold**',
      `${decorator('**')}<strong>bold</strong>${decorator('**')}`,
    )
  })

  it('should output u', function () {
    assertParsesToHtml(
      '__underscore__',
      `${decorator('__')}<u>underscore</u>${decorator('__')}`,
    )
  })

  it('should escape string', function () {
    assertParsesToHtml('\\*italics*', `${decorator('\\')}*italics*`)
  })

  it('should escape string with multiple \\', function () {
    assertParsesToHtml(
      '\\*\\*\\*italics***',
      `${decorator('\\')}*${decorator('\\')}*${decorator('\\')}*italics***`,
    )
  })

  it('should output code with single `', function () {
    assertParsesToHtml(
      '`code`',
      `${decorator('`')}<code>code</code>${decorator('`')}`,
    )
  })

  it('should output simple combined bold/italics', function () {
    assertParsesToHtml(
      '***bolditalics***',
      `${decorator('*')}<em>${decorator(
        '**',
      )}<strong>bolditalics</strong>${decorator('**')}</em>${decorator('*')}`,
    )

    assertParsesToHtml(
      '**bold *italics***',
      `${decorator('**')}<strong>bold ${decorator(
        '*',
      )}<em>italics</em>${decorator('*')}</strong>${decorator('**')}`,
    )
  })

  it('should output complex combined bold/italics', function () {
    assertParsesToHtml(
      '***bold** italics*',
      `${decorator('*')}<em>${decorator('**')}<strong>bold</strong>${decorator(
        '**',
      )} italics</em>${decorator('*')}`,
    )
    assertParsesToHtml(
      '*hi **there you***',
      `${decorator('*')}<em>hi ${decorator(
        '**',
      )}<strong>there you</strong>${decorator('**')}</em>${decorator('*')}`,
    )
  })

  it('should output del', function () {
    assertParsesToHtml(
      '~~strikethrough~~',
      `${decorator('~~')}<del>strikethrough</del>${decorator('~~')}`,
    )
  })

  it('should output autolinks', function () {
    assertParsesToHtml(
      '<https://satellite.im/>',
      `${decorator(
        '<',
      )}<span class="md-url">https://satellite.im/</span>${decorator('>')}`,
    )
  })

  it('should parse urls', function () {
    assertParsesToHtml(
      'https://satellite.im/',
      `<span class="md-url">https://satellite.im/</span>`,
    )
  })

  it('should parse spoilers', function () {
    assertParsesToHtml(
      '||spoiler||',
      `${decorator('||')}<span>spoiler</span>${decorator('||')}`,
    )
  })
})
