export function validURL(text: string): boolean {
  const pattern = /^(http|https|ws|wss|udp):\/\//
  return !!pattern.test(text) || !text
}
