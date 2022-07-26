export function addressToNumber(address: string) {
  return parseInt(address.slice(0, 10), 16)
}

export function toHex(str: string) {
  let res = ''
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16)
    res += hex
  }
  return res
}

export function stringToColor(str: string): string {
  const hash = stringToHash(str)
  return colors[hash]
}

function stringToHash(str: string): number {
  return (
    str.split('').reduce((p, c) => p + c.charCodeAt(0), 0) % (colors.length - 1)
  )
}

const colors = [
  '#fc5c65',
  '#fd9644',
  '#fed330',
  '#26de81',
  '#2bcbba',
  '#eb3b5a',
  '#fa8231',
  '#f7b731',
  '#20bf6b',
  '#0fb9b1',
  '#45aaf2',
  '#4b7bec',
  '#a55eea',
  '#778ca3',
  '#2d98da',
  '#3867d6',
  '#8854d0',
  '#a5b1c2',
  '#4b6584',
]
