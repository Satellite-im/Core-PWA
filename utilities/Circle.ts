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
