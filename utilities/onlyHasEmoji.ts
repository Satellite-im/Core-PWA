import emojiRegex from 'emoji-regex'

export function onlyHasEmoji(text: string): boolean {
  if (text.length === 0) {
    return false
  }

  const regex = emojiRegex()
  let length = 0
  for (const match of text.matchAll(regex)) {
    if (match.index !== length) {
      return false
    }

    length += match[0].length
  }
  return length === text.length
}
