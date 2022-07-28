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
  '#fc5c65', // Fiery Rose
  '#fd9644', // Royal Orange
  '#fed330', // Sunglow
  '#26de81', // UFO Green
  '#2bcbba', // Maximum Blue Green
  '#eb3b5a', // Desire
  '#fa8231', // Princeton Orange
  '#f7b731', // Saffron
  '#20bf6b', // Green (Crayola)
  '#0fb9b1', // Tiffany Blue
  '#45aaf2', // Picton Blue
  '#4b7bec', // Blueberry
  '#a55eea', // Lavender Indigo
  '#778ca3', // Shadow Blue
  '#2d98da', // Bleu De France
  '#3867d6', // Royal Blue
  '#8854d0', // Amethyst
  '#a5b1c2', // Cadet Blue (Crayola)
  '#4b6584', // Dark Electric Blue
]
