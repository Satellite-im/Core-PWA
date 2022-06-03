/**
 * @method stringLength
 * @description give accurate string length
 * @param {string} str
 * @returns {number} length
 * https://gomakethings.com/emoji-are-still-weird-but-modern-browser-methods-help/
 */
export function stringLength(str: string): number {
  // segmenter is best, but firefox doesnt support it yet
  if (Intl.Segmenter) {
    return Array.from(new Intl.Segmenter().segment(str)).length
  }
  // backup firefox implementation
  const joiner = '\u{200D}'
  const split = str.split(joiner)
  let count = 0

  for (const s of split) {
    // removing the variation selectors
    const num = Array.from(s.split(/[\uFE00-\uFE0F]/).join('')).length
    count += num
  }

  // assuming the joiners are used appropriately
  return count / split.length
}
