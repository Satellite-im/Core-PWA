export function hexToRGB(hex: string) {
  const int = parseInt(hex.replace('#', ''), 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return [r, g, b].join(', ')
}
